const express = require('express')
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
const router = express.Router();

router.post('/cadastro', (req, res ) => {

})
