module.exports.log = (con, actorId, action, targetId = null, details = null) => {
  try {
    con.query(
      `INSERT INTO AUDIT_LOGS
       (actor_user_id, target_user_id, action, details)
       VALUES (?, ?, ?, ?)`,
      [
        actorId,
        targetId,
        action,
        details ? JSON.stringify(details) : null
      ],
      (err) => {
        if (err) {
          console.error('AUDIT LOG FAILED:', err);
          // swallow error on purpose
        }
      }
    );
  } catch (e) {
    console.error('AUDIT EXCEPTION:', e);
    // never throw
  }
};
