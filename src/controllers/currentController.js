import passport from 'passport';

export const getCurrentUser = async (req, res) => {
    try {
        const user = await passport.authenticate('current', { session: false });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};