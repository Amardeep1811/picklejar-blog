import Petition from '../models/Petition.js';
import PetitionSignature from '../models/PetitionSignature.js';
import asyncHandler from '../utils/asyncHandler.js';
import { z } from 'zod';
import { getCached, setCached } from '../utils/simpleCache.js';

export const getPetitions = asyncHandler(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const filter = {};
  if (req.query.active !== undefined) {
    filter.active = req.query.active === 'true';
  } else {
    filter.active = true;
  }

  let query = Petition.find(filter).sort({ createdAt: -1 });
  
  if (req.query.limit) {
    query = query.limit(parseInt(req.query.limit, 10));
  }

  const petitions = await query.lean();
  res.status(200).json({ success: true, data: petitions });
});

export const createPetition = asyncHandler(async (req, res) => {
  const petition = await Petition.create(req.body);
  if (process.env.NODE_ENV !== 'production') {
    console.log('--- DB WRITE: createPetition ---', {
      id: petition._id,
      title: petition.title,
      db: petition.collection.dbName,
      collection: petition.collection.name
    });
  }
  res.status(201).json({ success: true, message: 'Petition created', data: petition });
});

export const updatePetition = asyncHandler(async (req, res) => {
  const petition = await Petition.findById(req.params.id);
  if (!petition) {
    res.status(404);
    throw new Error('Petition not found');
  }

  Object.assign(petition, req.body);
  const updatedPetition = await petition.save();
  
  res.status(200).json({ success: true, message: 'Petition updated', data: updatedPetition });
});

export const deletePetition = asyncHandler(async (req, res) => {
  const petition = await Petition.findById(req.params.id);
  if (!petition) {
    res.status(404);
    throw new Error('Petition not found');
  }
  await petition.deleteOne();
  res.status(200).json({ success: true, message: 'Petition deleted' });
});

export const signPetition = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  // Validate email
  const emailSchema = z.string().email('Invalid email format');
  const validationResult = emailSchema.safeParse(email);
  
  if (!validationResult.success) {
    res.status(400);
    throw new Error('Invalid email format');
  }

  const petition = await Petition.findById(id);
  
  if (!petition) {
    res.status(404);
    throw new Error('Petition not found');
  }
  
  if (!petition.active) {
    res.status(400);
    throw new Error('This petition is no longer active');
  }

  try {
    await PetitionSignature.create({ petition: id, email: validationResult.data });
    
    // Increment atomically
    const updatedPetition = await Petition.findByIdAndUpdate(
      id,
      { $inc: { signatureCount: 1 } },
      { new: true }
    );
    
    res.status(200).json({ 
      success: true, 
      message: 'Petition signed successfully', 
      signatureCount: updatedPetition.signatureCount 
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      throw new Error("You've already signed this petition");
    }
    throw error;
  }
});

export const getPetitionSignatures = asyncHandler(async (req, res) => {
  const signatures = await PetitionSignature.find({ petition: req.params.id })
    .select('email createdAt')
    .sort({ createdAt: -1 })
    .lean();
  res.status(200).json({ success: true, data: signatures });
});
