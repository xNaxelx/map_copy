import {useCallback, useEffect, useState} from 'react'
import Sidebar from "./Sidebar.jsx";
import PageHeader from "./PageHeader.jsx";
import DataMap from "./DataMap.jsx";
import {loadBorderSigns, loadData} from "./api.js";
import {APIProvider} from "@vis.gl/react-google-maps";


function App() {
    const [cases, setCases] = useState([]);
    const [borderSigns, setBorderSigns] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);

    useEffect(() => {
        loadData(2024).then(setCases);
        loadBorderSigns().then(setBorderSigns)
    }, []);


    const handleSelectCase = useCallback((selected) => {
        setSelectedCase(selected);
    }, []);

    return (
        <div className="container">
            <PageHeader></PageHeader>
            <div className="content">
                <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
                    <DataMap selectedCase={selectedCase} onSelectCase={handleSelectCase} cases={cases} borderSigns={borderSigns}/>
                </APIProvider>
                <Sidebar selectedCase={selectedCase} onSelectCase={handleSelectCase} cases={cases}></Sidebar>
            </div>
        </div>
    );
}

export default App
