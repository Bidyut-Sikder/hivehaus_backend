import { Request, Response } from "express";

import TryCatchError from "../../utils/TryCatchError";
import { RoomService } from "./room.serverces";


const createRoom = TryCatchError(async (req: Request, res: Response) => {
   
  
    const result = await RoomService.createRoomService(req)

    res.status(200).json({
        success: true,
        message: 'Room added successfully',
        data: result
    })

})

const getRooms = TryCatchError(async (req: Request, res: Response) => {

    const result = await RoomService.getRoomsService(req.query);

    if (result.length === 0) {
        res.status(404).json({
            success: false,
            message: 'No Data Found',
            data: result
        })
    } else {
        res.status(200).json({
            success: true,
            message: 'Rooms retrieved successfully',
            data: result
        })
    }
})

const getRoomById = TryCatchError(async (req: Request, res: Response) => {

    const result = await RoomService.getRoomByIdService(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Rooms retrieved successfully',
        data: result
    })
})

const updateSingleRoom = TryCatchError(async (req: Request, res: Response) => {
   



    const result = await RoomService.updateSingleRoomService(req);

 
    res.status(200).json({
        success: true,
        message: 'Room updated successfully',
        data: 'result'
    })
})

const deleteRoom = TryCatchError(async (req: Request, res: Response) => {
    const result = await RoomService.deleteSingleRoomService(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Room deleted successfully',
        data: result
    })
})


export const RoomController = {
    createRoom,
    getRooms,
    getRoomById,
    updateSingleRoom,
    deleteRoom
}