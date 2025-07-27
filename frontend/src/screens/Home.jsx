/* eslint-disable no-unused-vars */
import React, {useContext, useState, useEffect} from 'react'
import {UserContext} from '../context/user.context'
import axios from '../config/axios'
import {useNavigate} from 'react-router-dom'

const Home = () => {

    const {user} = useContext(UserContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projectName, setProjectName] = useState(null)
    const [project, setProject] = useState([])

    const navigate = useNavigate()

    function createProject(e){
      e.preventDefault();

      axios.post('/projects/create',{
        name:projectName
      }).then((res)=>{
        setIsModalOpen(false)
      }).catch((error)=>{
        console.log(error)
      })
    }

    useEffect(()=>{
      axios.get('/projects/all')
      .then((res)=>{
        setProject(res.data.projects)
      }).catch((error)=>{
        console.log(error)
      })

    },[])

    return (
    <main className="flex min-h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-4 space-y-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-3">
          <button className="flex items-center space-x-2 text-left w-full hover:text-blue-400">
            <i className="ri-dashboard-line"></i>
            <span>Dashboard</span>
          </button>
          <button className="flex items-center space-x-2 text-left w-full hover:text-blue-400">
            <i className="ri-folder-line"></i>
            <span>Projects</span>
          </button>
          <button className="flex items-center space-x-2 text-left w-full hover:text-blue-400">
            <i className="ri-settings-3-line"></i>
            <span>Settings</span>
          </button>
          <button className="flex items-center space-x-2 text-left w-full text-green-400 hover:text-green-600">
            <i className="ri-brain-line"></i>
            <a href="/CodeReview"><span>AI Review</span></a>
          </button>
        </nav>
      </aside>
      <section className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-gray-700 p-2">
              <i className="ri-user-line text-xl"></i>
            </div>
            <span>Your Name</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-md p-6">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          {project.length === 0 ? (
            <div className="p-6 bg-gray-700 rounded-md text-center">No projects yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {project.map((project) => (
                <div
                  key={project._id}
                  onClick={() => {
                    navigate(`/project`, { state: { project } });
                  }}
                  className="cursor-pointer p-4 bg-gray-700 hover:bg-gray-600 rounded-md"
                >
                  <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span><i className="ri-user-line mr-1"></i> {project.users.length} Collaborators</span>
                    <i className="ri-delete-bin-line text-red-400"></i>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 text-right">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Project
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="text-blue-400 hover:underline">
              Sign up
            </a>
          </p>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-1/3 text-black">
              <h2 className="text-xl mb-4">Create New Project</h2>
              <form onSubmit={createProject}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Project Name
                  </label>
                  <input
                    onChange={(e) => setProjectName(e.target.value)}
                    value={projectName}
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
