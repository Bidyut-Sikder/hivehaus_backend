import httpStatus from "http-status";
import AppError from "../../errors/AppError";

import { TSlot } from "./slot.interfaces";
import { SlotModal } from "./slot.model";
import { RoomModel } from "../room/room.model";
import { minutesToTime, timeMinutes } from "./slot.utlis";

const createCustomSlotService = async (payload: TSlot) => {

  const { room, date, startTime, endTime } = payload;
  //1 day = 24 × 60 = 1440 minutes
  const startMinutes = timeMinutes(startTime);
  const endMinutes = timeMinutes(endTime);
  const totalDuration = endMinutes - startMinutes;

  if (totalDuration < 0) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "End Time must be after start time"
    );
  }

  const roomRecord = await RoomModel.findById(room);

  if (!roomRecord) {
    throw new AppError(httpStatus.NOT_FOUND, "Room is not found");
  }

  // Check for existing slots that overlap with the given time range
  const overlappingSlots = await SlotModal.find({
    room,
    date,
    $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
  });

  if (overlappingSlots.length > 0) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A slot already exists for this time range"
    );
  }

  //creates a timeSlot for the room  every 1 hour
  const newTimeSlot = await SlotModal.create(payload);
  
  return newTimeSlot;
};

const createSlotService = async (payload: TSlot) => {

  const { room, date, startTime, endTime } = payload;
  //1 day = 24 × 60 = 1440 minutes
  const startMinutes = timeMinutes(startTime);
  const endMinutes = timeMinutes(endTime);
  const totalDuration = endMinutes - startMinutes;

  console.log(
    `Creating slots for room: ${room}, date: ${date}, startTime: ${startTime}, endTime: ${endTime}`
  );
  console.log(
    `Start Minutes: ${startMinutes}, End Minutes: ${endMinutes}, Total Duration: ${totalDuration}`
  );

  if (totalDuration < 0) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "End Time must be after start time"
    );
  }

  const roomRecord = await RoomModel.findById(room);

  if (!roomRecord) {
    throw new AppError(httpStatus.NOT_FOUND, "Room is not found");
  }

  // Check for existing slots that overlap with the given time range
  const overlappingSlots = await SlotModal.find({
    room,
    date,
    $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
  });

  if (overlappingSlots.length > 0) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A slot already exists for this time range"
    );
  }

  const numberOfSlots = Math.floor(totalDuration) / 60;
  //creates time slot every 1 hour
  const slots = [];
  for (let i = 0; i < numberOfSlots; i++) {
    const slotStartTime = minutesToTime(startMinutes + i * 60);
    const slotEndTime = minutesToTime(startMinutes + (i + 2) * 60);

    const slot = {
      room,
      date,
      startTime: slotStartTime,
      endTime: slotEndTime,
    };

    //creates a timeSlot for the room  every 1 hour
    const createdSlot = await SlotModal.create(slot);
    slots.push(createdSlot);
  }

  return slots;
};

const getAvailableAllSlotsService = async (query: Record<string, unknown>) => {
  const { date, roomId } = query;

  const filter: Record<string, unknown> = {
    isBooked: false,
    isDeleted: false,
  };

  if (date) {
    filter.date = date;
  }

  if (roomId) {
    filter.room = roomId;
  }

  const result = await SlotModal.find(filter).populate("room");
  return result;
};

const updateSlotsService = async (id: string, updateData: Partial<TSlot>) => {
  const existingSlot = await SlotModal.findById(id);
  if (!existingSlot) {
    throw new Error("Slot not found.");
  }

  if (existingSlot.isBooked) {
    throw new Error("Cannot update a booked slot.");
  }

  if (updateData.startTime && updateData.endTime) {
    const { startTime, endTime } = updateData;

    const conflictingSlots = await SlotModal.find({
      room: existingSlot.room,
      date: existingSlot.date,
      _id: { $ne: id },
      $or: [
        {
          startTime: { $lt: endTime, $gte: startTime },
        },
        {
          endTime: { $gt: startTime, $lte: endTime },
        },
        {
          startTime: { $lte: startTime },
          endTime: { $gte: endTime },
        },
      ],
    });

    if (conflictingSlots.length > 0) {
      throw new Error("Time conflict with another slot.");
    }
  }

  const updatedSlot = await SlotModal.findOneAndUpdate(
    { _id: id },
    { startTime: updateData.startTime, endTime: updateData.endTime },
    { new: true }
  );
  return updatedSlot;
};

const deleteSlotService = async (id: string) => {
  const existingSlot = await SlotModal.findById(id);

  if (!existingSlot) {
    throw new Error("Slot not found.");
  }

  if (existingSlot.isDeleted) {
    throw new Error("Slot is already deleted.");
  }

  const updatedSlot = await SlotModal.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  return updatedSlot;
};

export const slotService = {
  createCustomSlotService,
  createSlotService,
  getAvailableAllSlotsService,
  updateSlotsService,
  deleteSlotService,
};
