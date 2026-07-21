import Petition from '../models/Petition.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getPetitions = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.active !== undefined) {
    filter.active = req.query.active === 'true';
  }

  let query = Petition.find(filter).sort({ createdAt: -1 });
  
  if (req.query.limit) {
    query = query.limit(parseInt(req.query.limit, 10));
  }

  const petitions = await query;
  res.status(200).json({ success: true, data: petitions });
});

export const createPetition = asyncHandler(async (req, res) => {
  const petition = await Petition.create(req.body);
  console.log('--- DB WRITE: createPetition ---', {
    id: petition._id,
    title: petition.title,
    db: petition.collection.dbName,
    collection: petition.collection.name
  });
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
