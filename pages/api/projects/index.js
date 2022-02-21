const { connectToDatabase } = require('../../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;

export default async function handler(req, res) {
  // switch the methods
  switch (req.method) {
    case 'GET': {
      return getProjects(req, res);
    }

    case 'POST': {
      return addProject(req, res);
    }

    case 'PUT': {
      return updateProject(req, res);
    }

    case 'DELETE': {
      return deleteProject(req, res);
    }
  }
}

async function getProjects(req,res){
  try {
    // connect to the database
    let { db } = await connectToDatabase();
    // fetch the Projects
    let projects = await db
      .collection('projects')
      .find({})
      .sort({ published: -1 })
      .toArray();
    // return the Projects
    return res.json({
      message: JSON.parse(JSON.stringify(projects)),
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

async function addProject(req, res) {
  try {
    // connect to the database
    let { db } = await connectToDatabase();
    // add the Project
    await db.collection('projects').insertOne(JSON.parse(req.body));
    // return a message
    return res.json({
      message: 'Project added successfully, please wait to redirect',
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

async function updateProject(req, res) {
  try {
    // connect to the database
    let { db } = await connectToDatabase();

    // update the published status of the Project
    await db.collection('projects').updateOne(
      {
        _id: new ObjectId(req.body),
      },
      { $set: { published: true } }
    );

    // return a message
    return res.json({
      message: 'Project updated successfully',
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

async function deleteProject(req, res) {
  try {
    // Connecting to the database
    let { db } = await connectToDatabase();

    // Deleting the Project
    await db.collection('projects').deleteOne({
      _id: new ObjectId(req.body),
    });

    // returning a message
    return res.json({
      message: 'Project deleted successfully',
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