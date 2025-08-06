import multer from 'multer';

// Set up storage for uploaded files
const storage = multer.diskStorage({

})

export const upload = multer({storage});