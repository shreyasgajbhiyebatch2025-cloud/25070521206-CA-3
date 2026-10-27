const AuditLog = require('../models/AuditLog');
const { isConnected } = require('../config/db');
const mockStore = require('../services/mockStore');

// @desc    Get clinical audit logs with filters
// @route   GET /api/audit
// @access  Private / Public
const getLogs = async (req, res) => {
  try {
    const { role, action, search, limit = 100 } = req.query;

    if (isConnected()) {
      try {
        const filter = {};
        if (role && role !== 'ALL') {
          filter.userRole = role;
        }
        if (action && action !== 'ALL') {
          filter.action = new RegExp(action, 'i');
        }
        if (search) {
          const q = new RegExp(search, 'i');
          filter.$or = [
            { userName: q },
            { patientName: q },
            { medicineName: q },
            { details: q }
          ];
        }

        const logs = await AuditLog.find(filter)
          .sort({ timestamp: -1 })
          .limit(parseInt(limit, 10) || 100);

        return res.json({
          success: true,
          total: logs.length,
          data: logs
        });
      } catch (dbErr) {
        console.warn('[Audit Controller] Mongoose getLogs fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    let logs = mockStore.getAuditLogs(parseInt(limit, 10) || 100);
    if (role && role !== 'ALL') {
      logs = logs.filter(l => l.userRole === role);
    }
    if (action && action !== 'ALL') {
      logs = logs.filter(l => l.action.toLowerCase().includes(action.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(
        l =>
          (l.userName && l.userName.toLowerCase().includes(q)) ||
          (l.patientName && l.patientName.toLowerCase().includes(q)) ||
          (l.medicineName && l.medicineName.toLowerCase().includes(q)) ||
          (l.details && l.details.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      total: logs.length,
      data: logs
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getLogs
};
