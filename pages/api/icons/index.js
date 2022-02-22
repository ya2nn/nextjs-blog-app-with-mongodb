const { connectToDatabase } = require('../../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;

export default async function handler(req, res) {
  // switch the methods
  switch (req.method) {
    case 'GET': {
      return getIcons(req, res);
    }

    case 'POST': {
      return addIcon(req, res);
    }

    case 'PUT': {
      return updateIcon(req, res);
    }

    case 'DELETE': {
      return deleteIcon(req, res);
    }
  }
}

async function getIcons(req,res){
  try {
    // connect to the database
    let { db } = await connectToDatabase();
    // fetch the Icons
    let icons = await db
      .collection('icons')
      .find({})
      .sort({ published: -1 })
      .toArray();
    // return the Icons
    return res.json({
      message: JSON.parse(JSON.stringify(icons)),
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

async function addIcon(req, res) {
  try {
    // connect to the database
    let { db } = await connectToDatabase();
    // add the Icon
    await db.collection('icons').insertOne(JSON.parse(req.body));
    // return a message
    return res.json({
      message: 'Icon added successfully, please wait to redirect',
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

async function updateIcon(req, res) {
  try {
    // connect to the database
    let { db } = await connectToDatabase();

    // update the published status of the Icon
    await db.collection('icons').updateOne(
      {
        _id: new ObjectId(req.body),
      },
      { $set: { published: true } }
    );

    // return a message
    return res.json({
      message: 'Icon updated successfully',
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

async function deleteIcon(req, res) {
  try {
    // Connecting to the database
    let { db } = await connectToDatabase();

    // Deleting the Icon
    await db.collection('icons').deleteOne({
      _id: new ObjectId(req.body),
    });

    // returning a message
    return res.json({
      message: 'Icon deleted successfully',
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