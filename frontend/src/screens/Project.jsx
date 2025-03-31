/* eslint-disable no-unused-vars */
import React,{useState, useEffect, useContext, useRef} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket , receiveMessage , sendMessage } from '../config/socket'
import { UserContext } from '../context/user.context'
import MarkDown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webContainer'

function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}

const Project = () => {

    const location = useLocation()

    const [isSidePanelOpwn, setIsSidePanelOpwn] = useState(false)
    const [textMessage, setTextMessage] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [SelectedUserId, setSelectedUserId] = useState([])
    const [users, setUsers] = useState([])
    const [project, setProject] = useState(location.state.project)
    const [messages,setMessages] = useState([])
    const [fileTree, setFileTree] = useState({})
    const [currentFile, setCurrentFile] = useState(null)
    const [openFiles, setOpenFiles] = useState([])
    const [webContainer, setWebContainer] = useState(null)
    const [iFrameUrl, setIFrameUrl] = useState(null)
    const [runProcess, setRunProcess] = useState(null)

    const {user} = useContext(UserContext)

    const messageBox = React.createRef()

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });
    }

    function addCollaborators() {
        axios.put('/projects/add-user',{
            projectId: location.state.project._id,
            users: Array.from(SelectedUserId)
        }).then(res => {
            console.log(res.data)
            setIsModalOpen(false)
        }).catch(err => {
            console.log(err)
        })
    }

    function send() {
        if (!textMessage.trim()) return;
    
        const userMessage = { sender: user, textMessage };
        
        sendMessage('project-message', userMessage); 
        setMessages(prevMessages => [...prevMessages, userMessage]); 
        setTextMessage(''); 
    
        scrollToBottom();
    }

    // in future using speech to text
    function listen(){
        console.log('listens')
    }

    function writeAiMessage(message) {
        try {
            // Check if message is already an object
            const messageObject = typeof message === "string" ? JSON.parse(message) : message;
    
            return (
                <div className="overflow-auto bg-slate-950 text-white mx-2 rounded-sm">
                    <MarkDown
                        children={messageObject?.text || "Invalid message format"}
                        options={{
                            overrides: {
                                code: SyntaxHighlightedCode,
                            },
                        }}
                    />
                </div>
            );
        } catch (error) {
            console.error("JSON Parse Error:", error, "Message received:", message);
            return <div className="text-red-500">Error parsing AI message.</div>;
        }
    }
    

    useEffect(()=>{
        initializeSocket(project._id)

        if(!webContainer){
            getWebContainer().then(container => {
                setWebContainer(container)
                console.log("container started")
            })
        }

        const handleMessage = (data) => {
            console.log("Raw data received:", data);
        
            setMessages(prevMessages => [...prevMessages, data]);
        
            try {
                // Ensure data.message is a valid string
                let jsonString = data.message.trim(); // Trim spaces and extra characters
        
                // Check if the string is valid JSON
                if (jsonString.startsWith("{") && jsonString.endsWith("}")) {
                    const message = JSON.parse(jsonString);
                    console.log("Parsed message:", message);
        
                    if (message?.fileTree) {
                        setFileTree(message.fileTree);
                        webContainer?.mount(message.fileTree);
                    } else {
                        console.warn("fileTree is undefined or null:", message);
                    }
                } else {
                    console.error("Invalid JSON format received:", jsonString);
                }
            } catch (error) {
                console.error("Error parsing JSON:", error, "Raw message:", data.message);
            }
        
            // scrollToBottom();
        };    

        receiveMessage('project-message', handleMessage);

        axios.get(`/projects/get-project/${location.state.project._id}`)
        .then(res => {
            setProject(res.data.project)
            // setFileTree(res.data.project.fileTree)
        })
        .catch(err => {
            console.log(err)
        })

        axios.get('/users/all')
        .then(res=>{
            setUsers(res.data.users)
        })
        .catch(err=>{
            console.log(err)
        })

        return () => {
            receiveMessage('project-message', handleMessage, true); // Pass `true` to remove the listener
        };
    },[project._id])

    function saveFileTree(ft){
        axios.put('/projects/update-file-tree',{
            projectId:project._id,
            fileTree:ft
        }).then(res=>{
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

  return (
    <main className='h-screen w-screen flex'>

        <section className="left relative h-full w-1/3 flex flex-col bg-slate-300">
            <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-100'>
                <button className='p-2 flex items-center gap-2' onClick={()=>setIsSidePanelOpwn(!isSidePanelOpwn)}>
                    <i className='ri-group-fill'></i>
                    <h1 className='font-semibold text-lg'>{project.name}</h1>
                </button>
                <div className="relative group flex flex-col items-center">
                    <button className="px-2 py-1 rounded-full hover:bg-gray-200" onClick={() => setIsModalOpen(true)}><i className="ri-add-fill text-2xl"></i></button>
                    <p className="absolute top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">Add Collaborators</p>
                </div>
            </header>

            <div className="conversation-area flex-grow flex flex-col gap-1 overflow-hidden">
                <div ref={messageBox} className="message-box p-1 flex-grow flex flex-col overflow-auto max-h-full gap-1">
                        {messages.map((msg, index) => (
                            <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-96' : 'max-w-52'} ${msg.sender._id == user._id.toString() && 'ml-auto'}  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}>
                                <small className='opacity-65 text-xs'>{msg.sender.email}</small>
                                {msg.sender._id === 'ai' ? (
                                writeAiMessage(msg.message)
                                ) : (
                                <p className='text-sm'>{msg.textMessage}</p>
                                )}
                            </div>
                        ))}
                </div>
                <div className="flex flex-col bg-slate-100 p-3 rounded-t-3xl w-full">
                    <input onKeyDown={(e)=>{if(e.key==="Enter" && textMessage.trim()){send()}}} value={textMessage} onChange={(e)=>setTextMessage(e.target.value)} type="text" className="-my-2 bg-slate-100 text-gray-900 text-lg placeholder-gray-500 focus:outline-none px-4 py-2 w-full rounded-t-full" placeholder="Ask anything"/>
                    <div className="flex justify-between mt-1 -mb-1 ">
                        <button className="text-gray-900 px-2 rounded-full hover:bg-gray-200"><i className="text-2xl font-thin ri-add-fill"></i></button>
                        <button onClick={ textMessage.trim()? send : listen } className="text-gray-900 px-2 rounded-full hover:bg-gray-200"><i className={`text-xl font-thin ${textMessage.trim() ? "ri-send-plane-line" : "ri-mic-2-line"}`}></i></button>
                    </div>
                </div>
            </div>

            <div className={`sidepanel w-full h-full flex flex-col gap-2 bg-slate-200 transition-all absolute ${isSidePanelOpwn?'translate-x-0' : '-translate-x-full'} top-0`}>
                <header className='flex justify-between items-center py-1 px-3 bg-slate-100'>
                    <h1 className='text-lg font-semibold'>Collaborators</h1>
                    <button className='p-2' onClick={()=>setIsSidePanelOpwn(!isSidePanelOpwn)}>
                        <i className='text-3xl ri-close-fill'></i>
                    </button>
                </header>
                <div className="users flex flex-col gap-2">
                    {project.users && project.users.map(users => {
                        return (<div className="user cursor-pointer hover:bg-slate-300 p-2 flex gap-2 items-center">
                                <div className='aspect-square rounded-full p-6 text-white w-fit h-fit flex items-center justify-center bg-slate-600'><i className='text-2xl absolute ri-user-fill'></i></div>
                                <h1 className='font-semibold text-lg'>{users.email}</h1>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>

        <section className='right flex-grow h-full w-2/3 flex'>
            <div className="explorer h-full w-1/5 bg-slate-700 p-2">
                <div className="file-tree flex flex-col gap-2 w-full">
                    {
                        Object.keys(fileTree).map((file,index) => (
                            <button onClick={()=>{setCurrentFile(file) 
                                setOpenFiles([ ...new Set([ ...openFiles, file ]) ])
                            }} className="treeElement cursor-pointer px-2 py-1 flex items-center bg-slate-400 w-full overflow-auto">
                                <p className='font-semibold text-lg'>{file}</p>
                            </button>
                        ))
                    }
                </div>
            </div>
            
            <div className="code-editor h-full w-4/5 bg-slate-800 flex flex-col">
                <div className='code-editor-header flex items-center justify-between bg-slate-400 h-fit'>
                    <div className='files flex'>
                        {
                            openFiles.map((file,index)=>(
                                <div className={`flex cursor-default items-center p-2 ${currentFile === file ? 'bg-slate-500' : ''}`}>
                                    <h1 onClick={()=>{setCurrentFile(file)}} className='text-md'>{file}</h1>
                                    <button className='cursor-pointer' onClick={()=>{
                                        setOpenFiles(openFiles.filter(f => f !== file)); 
                                        if (currentFile === file) {
                                            setCurrentFile(null); 
                                        }
                                    }}>
                                        <i className='ri-close-fill'></i>
                                    </button>
                                </div>
                            ))
                        }
                    </div>

                    <div className="actions flex gap-2">
                    <button
                        onClick={async () => {
                            await webContainer.mount(fileTree)

                            const installProcess = await webContainer.spawn("npm",["install"])
                            installProcess.output.pipeTo(new WritableStream({
                                write(chunk){
                                    console.log(chunk);
                                }
                            }))

                            if(runProcess){
                                runProcess.kill()
                            }
                            let tempRunProcess = await webContainer.spawn("npm",["start"])
                            tempRunProcess.output.pipeTo(new WritableStream({
                                write(chunk){
                                    console.log(chunk);
                                }
                            }))
                            setRunProcess(tempRunProcess)

                            webContainer.on('server-ready',(port,url)=>{
                                console.log(port,url)
                                setIFrameUrl(url)
                            })
                        }}
                        className="p-2 px-4 bg-slate-500"
                    >Run</button>
                    </div>
                </div>
                <div className='code-content flex flex-grow overflow-auto scrollbar-hidden'>
                    {fileTree[currentFile] && (
                        <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                            <pre className="hljs h-full">
                                <code
                                    className="hljs h-full outline-none"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => {
                                        const updatedContent = e.target.innerText;
                                        const ft = {
                                            ...fileTree,
                                            [ currentFile ]: {
                                                file: {
                                                    contents: updatedContent
                                                }
                                            }
                                        }
                                        setFileTree(ft)
                                        saveFileTree(ft)
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value
                                    }}
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        paddingBottom: '25rem',
                                        counterSet: 'line-numbering',
                                    }}
                                />
                            </pre>
                        </div>
                    )}
                </div>
            </div>

            {iFrameUrl && webContainer && 
                <div className='flex flex-col h-full min-w-96'>
                    <div className='address-bar'>
                        <input onChange={(e)=>setIFrameUrl(e.target.value)} type="text" value={iFrameUrl} className='w-full p-2 px-4 bg-slate-200'/>
                    </div>
                    <iframe src={iFrameUrl} className='w-full h-full'></iframe>
                </div>
            }
            
            
        </section>

        {isModalOpen &&
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
                    <header className='flex justify-between items-center mb-4'>
                        <h2 className='text-xl font-semibold'>Select User</h2>
                        <button onClick={() => setIsModalOpen(false)} className='p-2'>
                            <i className="ri-close-fill"></i>
                        </button>
                    </header>
                    <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                        {users.map(user => (
                            <div key={user.id} className={`user cursor-pointer ${Array.from(SelectedUserId).indexOf(user._id)!=-1?'bg-slate-200':''} p-2 flex gap-2 items-center`} onClick={()=>handleUserClick(user._id)}>
                                <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                    <i className="ri-user-fill absolute"></i>
                                </div>
                                <h1 className='font-semibold text-lg'>{user.email}</h1>
                            </div>
                        ))}
                    </div>
                    <button onClick={addCollaborators} className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'>
                        Add Collaborators
                    </button>
                </div>
            </div>
        }

        {/* <section className='w-2/3'></section> */}
    </main>
  )
}

export default Project