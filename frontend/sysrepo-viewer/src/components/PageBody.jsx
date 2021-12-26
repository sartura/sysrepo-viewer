import { useState } from 'react'
import ReactJson from 'react-json-view'
import FadeLoader from "react-spinners/FadeLoader"
import axios from 'axios'

export default function PageBody() {
    const [path, setPath] = useState('')
    const [datastore, setDatastore] = useState('Running')
    const [viewerObject, setViewerObject] = useState({})
    const [loading, setLoading] = useState(false)

    // /sysrepo-viewer-example:test-container

    function editCallback(data) {
        console.log(data)

        // construct path
        let valuePath = ""
        for (const n of data.namespace) {
            valuePath += "/" + n
        }
        valuePath += "/" + data.name

        setLoading(true)

        axios.post('http://localhost:5000/edit',
            {
                path: valuePath,
                datastore,
                value: data.new_value
            })
            .then(function (response) {
                const newObject = viewerObject
                newObject["sysrepo-viewer-example:test-container"]["valid"] = JSON.parse(data.new_value)
                setViewerObject(newObject)
                setLoading(false)
            })
            .catch(function (error) {
            })

        return false
    }

    function deleteCallback(data) {

    }

    function addCallback(data) {

    }

    async function getData(data) {
        console.log(path)
        console.log(datastore)
        setLoading(true)
        const response = await axios.post('http://localhost:5000/', {
            path,
            datastore: datastore.toLowerCase(),
        })
        setLoading(false)
        setViewerObject(response.data)
    }

    return (
        <div className="w-full flex">
            <div className="w-1/2 m-2 p-5 text-gray-400 border-2 border-gray-400">
                <h1 className="font-bold text-lg">Sysrepo options</h1>
                <div className="m-2">
                    <div className="m-2">
                        <label htmlFor="path" className="block text-sm font-medium mb-1">
                            Path
                        </label>
                        <input type="text" id="path" className="flex-1 block w-full rounded-none sm:text-sm border-gray-300" placeholder="Enter path to get" onChange={event => setPath(event.target.value)} />
                    </div>

                    <div className="m-2">
                        <label htmlFor="datastore" className="block text-sm font-medium mb-1">
                            Datastore
                        </label>
                        <select
                            id="datastore"
                            name="datastore"
                            autoComplete="datastore"
                            className="block py-2 px-3 bg-white sm:text-sm w-full" onChange={event => setDatastore(event.target.value)}>
                            <option>Running</option>
                            <option>Operational</option>
                        </select>
                    </div>
                    <div>
                        <button type="button" className="m-2 justify-center py-2 px-4 text-sm font-medium rounded-none text-white bg-indigo-600" onClick={getData}>
                            Get data
                        </button>
                    </div>

                </div>
                <div className="w-full flex justify-center">
                    <div className="mx-auto">
                        <FadeLoader color={'#4f46e5'} loading={loading} size={150} css={"margin-right: auto; margin-left: auto;"} />
                    </div>
                </div>
            </div>
            <div className="w-1/2 m-2 p-5 border-2 border-gray-400 text-gray-400 overflow-y-auto h-[45rem]">
                <h1 className="font-bold text-lg mb-2">Sysrepo JSON Viewer</h1>
                <ReactJson src={viewerObject}
                    theme="ocean"
                    iconStyle="square"
                    onEdit={datastore === 'Running' ? editCallback : false}
                    onDelete={datastore === 'Running' ? deleteCallback : false}
                    onAdd={datastore === 'Running' ? addCallback : false}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    indentWidth={4}
                    collapseStringsAfterLength={20}
                    validationMessage={null} />
            </div>
        </div>
    )
}