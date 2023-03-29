import React, { useEffect, useState } from "react";
import { Input, List } from "antd";
import "./EventLists.css";
import img from "../../assets/faceImoje.png";

const { Search } = Input;

const EventsList = () => {
	const [events, setEvents] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [searchLocation, setSearchLocation] = useState("");

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await fetch("/api/dashboard/events");
				const data = await response.json();
				setEvents(data);
				setFilteredEvents(data);
			} catch (error) {
				console.error(error.message);
			}
		};
		fetchEvents();
	}, []);

	const handleSearch = (text, location) => {
		const filtered = events.filter(
			(event) =>
				event.languages.toLowerCase().includes(text.toLowerCase()) &&
				event.location.toLowerCase().includes(location.toLowerCase())
		);
		setFilteredEvents(filtered);
		setSearchText(text);
		setSearchLocation(location);
	};

	return (
		<div className="event_conte">
			<div className="search-container">
				<Search
					placeholder="Search by language"
					allowClear
					onSearch={(value) => handleSearch(value, searchLocation)}
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 200 }}
				/>
				<Search
					placeholder="Search by location"
					allowClear
					onSearch={(value) => handleSearch(searchText, value)}
					value={searchLocation}
					onChange={(e) => setSearchLocation(e.target.value)}
					style={{ width: 200 }}
				/>
			</div>
			<List

				itemLayout="vertical"
				dataSource={filteredEvents}
				renderItem={(event) => (
					<section className="container_all-message" key={event.id} >
						<div className="overall_detail-message">
							<div>
								<img className="img-message" src={img} alt="" />
							</div>

							<div className="text-message">
								<div className="Native">
									<p>
										<span className="span_text">Title:</span> <span className="span_des"> {event.title} </span>
									</p>
									<p>
										<span className="span_text">Description:</span> <span className="span_des">  {event.description} </span>
									</p>
									<p>
										<span className="span_text">Datetime:</span>  <span className="span_des">{event.datetime} </span>
									</p>
								</div>
								<div>
									<p>
										<span className="span_text">Languages:</span>  <span className="span_des">{event.languages} </span>
									</p>
									<p>
										<span className="span_text">Location:</span> <span className="span_des">{event.location} </span>
									</p>
									<p>
										<span className="span_text">Link:</span> <a href={event.link}> Link </a>
									</p>
								</div>
							</div>
						</div>
					</section>
				)}
			/>
		</div>
	);
};

export default EventsList;
