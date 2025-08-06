
const protect = async (req, res, next) => {
    try {
        const {userId} = req.auth();
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        next();

    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export default protect;