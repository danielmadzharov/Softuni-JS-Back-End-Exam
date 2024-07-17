

const { Recepies } = require('../models/Recepies');


async function getAll() {
    return Recepies.find().lean();
}


async function getById(id) {
    return Recepies.findById(id).lean();
}
async function create(data, ownerId) {
 
    const record = new Recepies({
        title: data.title,
        ingredients: data.ingredients,
        instructions: data.instructions,
        description: data.description,
        image: data.image,
        owner: ownerId
    });
    await record.save();
    return record;
}

async function update(id, data, userId) {
    const record = await Recepies.findById(id);

    if (!record) {
        throw new ReferenceError('record not found' + id);

    }
    if (record.owner.toString() != userId) {
        throw new Error('access denied');

    }

    record.title = data.title;
    record.ingredients = data.ingredients;
    record.instructions = data.instructions;
    record.description = data.description;
    record.image = data.image;

    await record.save()

    return record;
}

async function getRecent(){
    return  Recepies.find().sort({ $natural: -1 }).limit(3).lean()
}


async function deleteById(id, userId){
    const record = await Recepies.findById(id);

    if (!record) {
        throw new ReferenceError('record not found' + id);

    }
    if (record.owner.toString() != userId) {
        throw new Error('access denied');

    }
    await Recepies.findByIdAndDelete(id)
}

async function addRecommend(recepyId, userId) {
    const record = await Recepies.findById(recepyId);

    if (!record) {
        throw new ReferenceError('Record not found: ' + recepyId);
    }
    if (record.owner.toString() === userId) {
        throw new Error('Cannot recommend your own recipe');
    }
    if (record.recommendList.includes(userId)) {
        throw new Error('Cannot recommend more than once');
    }

    record.recommendList.push(userId);
    await record.save();
    
    return record;
}


module.exports = {
    getAll,
    create,
    getById,
    update,
    deleteById,
    getRecent,
    addRecommend,
  
}