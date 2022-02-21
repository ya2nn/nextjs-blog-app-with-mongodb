const { connectToDatabase } = require('../../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;

export default async function handler(req, res) {
  // switch the methods
  switch (req.method) {
    case 'GET': {
      return getSections(req, res);
    }

    case 'POST': {
      return addSection(req, res);
    }

    case 'PUT': {
      return updateSection(req, res);
    }

    case 'DELETE': {
      return deleteSection(req, res);
    }
  }
}

async function getSections(req,res){
  try {
    // connect to the database
    let { db } = await connectToDatabase();
    // fetch the Sections
    let sections = await db
      .collection('sections')
      .find({})
      .sort({ published: -1 })
      .toArray();
    // return the Sections
    return res.json({
      message: JSON.parse(JSON.stringify(sections)),
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

async function addSection(req, res) {
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

async function updateSection(req, res) {
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

async function deleteSection(req, res) {
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