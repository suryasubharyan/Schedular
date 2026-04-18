
import Availability from "../models/Availability.js";

export const getAvailability = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.userId;

    const availability = await Availability.findOne({
      userId,
      date
    });

    res.json({
      bookedSlots: availability?.bookedSlots || []
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};