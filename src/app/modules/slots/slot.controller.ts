import { Request, Response } from "express";


import TryCatchError from "../../utils/TryCatchError";
import { slotService } from "./slot.services";



const createCustomSlot = TryCatchError(async (req: Request, res: Response) => {
    const result = await slotService.createCustomSlotService(req.body)

    res.status(200).json({
        success: true,
        message: 'Slots created successfully',
        data: result
    })
})



const createSlot = TryCatchError(async (req: Request, res: Response) => {
    const result = await slotService.createSlotService(req.body)

    res.status(200).json({
        success: true,
        message: 'Slots created successfully',
        data: result
    })
})


const getAvailableAllSlots = TryCatchError(async (req: Request, res: Response) => {

    const result = await slotService.getAvailableAllSlotsService(req.query)

    res.status(200).json({
        success: true,
        message: 'Available slots retrieved successfully',
        data: result
    })
})

const updatedSlots = TryCatchError(async (req: Request, res: Response) => {
    const result = await slotService.updateSlotsService(req.params.id, req.body)

    res.status(200).json({
        success: true,
        message: 'Slot Updated successfully',
        data: result
    })
})

const deleteSlot = TryCatchError(async (req: Request, res: Response) => {
    const result = await slotService.deleteSlotService(req.params.id)

    res.status(200).json({
        success: true,
        message: 'Slot Deleted successfully',
        data: result
    })
})

export const slotController = {
    createCustomSlot,
    createSlot,
    getAvailableAllSlots,
    updatedSlots,
    deleteSlot
}