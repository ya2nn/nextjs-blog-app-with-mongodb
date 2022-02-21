const { connectToDatabase } = require('../../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;

export default async function handler(req, res) {
  // switch the methods
  switch (req.method) {
    case 'GET': {
      return getSections(req, res);
    }

    case 'POST': {
      return addSections(req, res);
    }

    case 'PUT': {
      return updateSections(req, res);
    }

    case 'DELETE': {
      return deleteSections(req, res);
    }
  }
}

async function getSections(req,res){
  try {
    // connect to the database
    let { db } = await connectToDatabase();
    // Query param to search
    const { projectId } = req.query
    // fetch the Section
    let section = await db
      .collection('sections')
      .find({projectId})
      .sort({ published: -1 })
      .toArray();
    // return the Section
    return res.json({
      message: JSON.parse(JSON.stringify(section)),
      success: true,
    });
  } catch (error) {
    // return the error
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}

async function addSections(req, res) {
  try {
    // connect to the database
    let { db } = await connectToDatabase();
    // add the Section
    await db.collection('sections').insertOne(JSON.parse(req.body));
    // return a message
    return res.json({
      message: 'Section added successfully, please wait to redirect',
      success: true,
    });
  } catch (error) {
    // return an error
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}

async function updateSections(req, res) {
  try {
    // connect to the database
    let { db } = await connectToDatabase();

    // update the published status of the Section
    await db.collection('sections').updateOne(
      {
        _id: new ObjectId(req.body),
      },
      { $set: { published: true } }
    );

    // return a message
    return res.json({
      message: 'Section updated successfully',
      success: true,
    });
  } catch (error) {

    // return an error
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}

async function deleteSections(req, res) {
  try {
    // Connecting to the database
    let { db } = await connectToDatabase();

    // Deleting the Section
    await db.collection('sections').deleteOne({
      _id: new ObjectId(req.body),
    });

    // returning a message
    return res.json({
      message: 'Section deleted successfully',
      success: true,
    });
  } catch (error) {

    // returning an error
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}