import pool from '../config/db.js'

export const GetMyPermissions = async (req, res) => {
    try {
        const roleId = req.user.role_id;

        const [rows] = await pool.query(`
            SELECT p.permission_name
            FROM role_permissions rp
            JOIN permissions p ON rp.id_permission = p.id_permission
            WHERE rp.role_id = ?
        `, [roleId]);

        const permissions = rows.map(r => r.permission_name);

        res.json({ permissions });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};