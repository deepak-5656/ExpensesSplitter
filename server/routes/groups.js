const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Group = require('../models/Group');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendInviteEmail } = require('../utils/mailer');

// @route   GET /api/groups
// @desc    Get all groups for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('members', 'name email')
      .sort('-createdAt');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/groups
// @desc    Create a new group
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, emoji } = req.body;

    const group = await Group.create({
      name,
      description,
      emoji,
      createdBy: req.user._id,
      members: [req.user._id], // Creator is automatically a member
    });

    // Add group to user's list
    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: group._id },
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/groups/:id
// @desc    Get group by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members', 'name email')
      .populate('createdBy', 'name');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is member
    if (!group.members.some((member) => member._id.equals(req.user._id))) {
      return res.status(403).json({ message: 'Not authorized to view this group' });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/groups/:id/invite-email
// @desc    Invite a user to a group via email
// @access  Private
router.post('/:id/invite-email', protect, async (req, res) => {
  try {
    const { email } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if inviter is in group
    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to invite to this group' });
    }

    const invitedUser = await User.findOne({ email });

    if (invitedUser) {
      // User exists, add them directly to group if not already a member
      if (group.members.includes(invitedUser._id)) {
        return res.status(400).json({ message: 'User is already in the group' });
      }

      group.members.push(invitedUser._id);
      await group.save();

      await User.findByIdAndUpdate(invitedUser._id, {
        $push: { groups: group._id },
      });
      
      // Notify via socket
      req.io.to(group._id.toString()).emit('member:joined', { group: group._id, user: invitedUser });

      return res.json({ message: 'User added to group successfully', user: invitedUser });
    } else {
      // User doesn't exist, send invite link
      // Generate a temporary JWT token for the invite
      const inviteToken = jwt.sign(
        { groupId: group._id, email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const inviteLink = `${process.env.CLIENT_URL}/join/${inviteToken}`;
      
      const emailStatus = await sendInviteEmail(email, group.name, inviteLink);

      if (emailStatus === 'simulated') {
        res.json({ message: 'Email setup missing: Here is the invite link instead!', inviteLink, simulated: true });
      } else if (emailStatus === true) {
        res.json({ message: 'Invite email sent to user' });
      } else {
        res.status(500).json({ message: 'Failed to send invite email' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/groups/:id/invite-link
// @desc    Generate a generic invite link for a group
// @access  Private
router.get('/:id/invite-link', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if inviter is in group
    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to invite to this group' });
    }

    // Generate a generic JWT token for the invite without email
    const inviteToken = jwt.sign(
      { groupId: group._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const inviteLink = `${process.env.CLIENT_URL}/join/${inviteToken}`;
    
    res.json({ inviteLink });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/groups/join/:token
// @desc    Join group via invite token
// @access  Private (User must be logged in to join)
router.get('/join/:token', protect, async (req, res) => {
  try {
    // Verify token
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    
    const group = await Group.findById(decoded.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Ensure token email matches logged in user's email if it was sent to a specific email
    if (decoded.email && decoded.email !== req.user.email) {
       return res.status(403).json({ message: 'This invite was sent to a different email address' });
    }

    // Check if already member
    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already in this group' });
    }

    // Add to group
    group.members.push(req.user._id);
    await group.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: group._id },
    });

    req.io.to(group._id.toString()).emit('member:joined', { group: group._id, user: req.user });

    res.json({ message: 'Successfully joined group', groupId: group._id });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired invite token' });
  }
});

// @route   DELETE /api/groups/:id/leave
// @desc    Leave a group
// @access  Private
router.delete('/:id/leave', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if member
    if (!group.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are not in this group' });
    }

    // Remove from group
    group.members = group.members.filter(
      (memberId) => memberId.toString() !== req.user._id.toString()
    );
    await group.save();

    // Remove group from user
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { groups: group._id },
    });

    res.json({ message: 'Successfully left the group' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/groups/:id/add-user
// @desc    Add a user to a group by their User ID
// @access  Private
router.post('/:id/add-user', protect, async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if inviter is in group
    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to invite to this group' });
    }

    const invitedUser = await User.findById(userId);

    if (!invitedUser) {
      return res.status(404).json({ message: 'User not found with this ID' });
    }

    if (group.members.includes(invitedUser._id)) {
      return res.status(400).json({ message: 'User is already in the group' });
    }

    group.members.push(invitedUser._id);
    await group.save();

    await User.findByIdAndUpdate(invitedUser._id, {
      $push: { groups: group._id },
    });
    
    // Notify via socket
    req.io.to(group._id.toString()).emit('member:joined', { group: group._id, user: invitedUser });

    return res.json({ message: 'User added to group successfully', user: invitedUser });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
