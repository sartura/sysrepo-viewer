import { useState } from 'react'
import ReactJson from 'react-json-view'
import axios from 'axios'

function showError(error) {
    alert(error)
}

export default function PageBody() {
    const [path, setPath] = useState('')
    const [datastore, setDatastore] = useState('Running')
    const [viewObject, setViewObject] = useState({})
    const [editObject, setEditObject] = useState({})

    // /sysrepo-viewer-example:test-container

    function applyChanges() {
        axios.post('http://localhost:5000/edit',
            {
                modified: editObject
            })
            .then(function (response) {
                setViewObject(editObject)
            })
            .catch(function (error) {
                // don't change the view object - stays the same until errors resolved
                showError(error)
            })
    }

    function getData(data) {
        console.log(path)
        console.log(datastore)

        axios.post('http://localhost:5000/', {
            path,
            datastore: datastore.toLowerCase(),
        }).then(function (response) {
            setViewObject(response.data)
            setEditObject(response.data)
        }).catch(function (error) {
            showError(error)
        })
    }

    function editCallback(data) {
        setEditObject(data.updated_src)
    }

    function addCallback(data) {
        setEditObject(data.updated_src)
    }

    function deleteCallback(data) {
        setEditObject(data.updated_src)
    }

    return (
        <div className="flex-wrap">
            <div className="flex">
                <div className="w-1/2 m-4 p-5 border-2 border-gray-400 text-gray-400 overflow-y-auto h-[30rem]">
                    <h1 className="font-bold text-lg mb-2 uppercase">Editor</h1>
                    <ReactJson src={editObject}
                        theme="ocean"
                        onEdit={datastore === 'Running' ? editCallback : false}
                        onDelete={datastore === 'Running' ? addCallback : false}
                        onAdd={datastore === 'Running' ? deleteCallback : false}
                        displayDataTypes={false}
                        displayObjectSize={false}
                        indentWidth={4}
                        collapseStringsAfterLength={20}
                        validationMessage={null} />
                </div>
                <div className="w-1/2 m-4 p-5 border-2 border-gray-400 text-gray-400 overflow-y-auto h-[30rem]">
                    <h1 className="font-bold text-lg mb-2 uppercase">Viewer</h1>
                    <ReactJson src={viewObject}
                        theme="ocean"
                        displayDataTypes={false}
                        displayObjectSize={false}
                        indentWidth={4}
                        collapseStringsAfterLength={20}
                        validationMessage={null}
                        enableClipboard={false} />
                </div>
            </div>
            <div className="m-4 p-5 text-gray-400 border-2 border-gray-400 flex-wrap">
                <h1 className="font-bold text-lg uppercase">sysrepo options</h1>
                <div className="m-2">
                    <div className="m-2 flex">
                        <div className="w-1/2 m-2">
                            <label htmlFor="path" className="block text-sm font-medium mb-1 uppercase">
                                Path
                            </label>
                            <input type="text" id="path" className="flex-1 text-black font-semibold font-mono block w-full rounded-none sm:text-sm border-gray-300" placeholder="Enter path to get" onChange={event => setPath(event.target.value)} />
                        </div>

                        <div className="w-1/2 m-2">
                            <label htmlFor="datastore" className="block text-sm font-medium mb-1 uppercase">
                                Datastore
                            </label>
                            <select
                                id="datastore"
                                name="datastore"
                                autoComplete="datastore"
                                className="block py-2 px-3 text-black font-semibold font-mono bg-white sm:text-sm w-full" onChange={event => setDatastore(event.target.value)}>
                                <option>Running</option>
                                <option>Operational</option>
                            </select>
                        </div>
                    </div>

                    <div className="m-2 w-1/2">
                        <button type="button" className="m-2 justify-center py-2 px-4 text-sm font-medium rounded-none uppercase text-white bg-indigo-600" onClick={getData}>
                            fetch datastore data
                        </button>
                    </div>
                </div>
                <h1 className="font-bold text-lg uppercase">actions</h1>
                <div className="flex-wrap">
                    <div className="flex">
                        <button type="button" className="m-2 justify-center py-2 px-4 text-sm font-medium rounded-none uppercase text-white bg-indigo-600" onClick={applyChanges}>
                            apply changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}