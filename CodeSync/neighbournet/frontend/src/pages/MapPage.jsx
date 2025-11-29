import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import io from 'socket.io-client';
import CreateRequestModal from '../components/CreateRequestModal';

const socket = io('/', { path: '/socket.io' }); // Proxy handles connection to backend

function MapPage() {
    const [requests, setRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [position, setPosition] = useState([51.505, -0.09]); // Default: London

    useEffect(() => {
        // Get user location
        navigator.geolocation.getCurrentPosition((pos) => {
            setPosition([pos.coords.latitude, pos.coords.longitude]);
        });

        // Fetch initial requests
        fetchRequests();

        // Listen for new requests
        socket.on('newRequest', (newRequest) => {
            setRequests((prev) => [...prev, newRequest]);
        });

        return () => {
            socket.off('newRequest');
        };
    }, []);

    const fetchRequests = async () => {
        try {
            // In a real app, pass lat/lng/radius
            const res = await axios.get('/api/requests');
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
            <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {requests.map((req) => (
                    <Marker key={req._id} position={[req.location.coordinates[1], req.location.coordinates[0]]}>
                        <Popup>
                            <h3>{req.title}</h3>
                            <p>{req.description}</p>
                            <small>By: {req.createdBy?.username || 'Unknown'}</small>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <button
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000,
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
                onClick={() => setIsModalOpen(true)}
            >
                Create Request
            </button>

            {isModalOpen && (
                <CreateRequestModal
                    onClose={() => setIsModalOpen(false)}
                    currentPosition={position}
                    onSuccess={fetchRequests}
                />
            )}
        </div>
    );
}

export default MapPage;
