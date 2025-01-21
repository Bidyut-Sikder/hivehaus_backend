import express from 'express'
import { slotController } from './slot.controller'
import requestValidator from '../../middlewares/requestValidator'
import { zod_slotValidation } from './slot.validation'


const router = express.Router()

// user books a certain hours timeSlot for the specified room 

router.post('/custom-slots',
    // auth('user'),
    requestValidator(zod_slotValidation.zod_slotValidationSchema),
    slotController.createCustomSlot
)


router.post('/',
    // auth('admin'),
    requestValidator(zod_slotValidation.zod_slotValidationSchema),
    slotController.createSlot
)

router.get('/availability',
    slotController.getAvailableAllSlots
)

router.patch('/:id',
    requestValidator(zod_slotValidation.zod_updateSlotValidationSchema),
    slotController.updatedSlots
)

router.delete('/:id',
    slotController.deleteSlot
)

export const slotRoutes = router