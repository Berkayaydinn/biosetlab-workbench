// Welcome.js
import React, { useEffect, useState } from "react";
import axios from "axios";

import { LoadingOutlined } from "@ant-design/icons";

import Navbar from "../../components/header/Navbar";
import Pagination from "../../components/Pagination/Pagination";
import PlaygroundProjectsList from "../../components/PlaygroundProjectsList/PlaygroundProjectsList";


export default function Flows() {

  const [totalPages, setTotalPages] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [pageLimit, setPageLimit] = useState(4);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [noProjectsFound, setNoProjectsFound] = useState(false);

  useEffect(() => {
    setProjects([]);
    fetchData();
  }, [page]);


  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/project/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setProjects(response.data);
        setFilteredProjects(response.data);
        setTotalPages(Math.ceil(response.data.length / pageLimit));
        setTotalProjects(response.data.length);
        setNoProjectsFound(response.data.length === 0);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilteredProjects(projects.filter((project) => {
      return project.name.toLowerCase().includes(searchQuery.toLowerCase());
    }));
  };

  return (
    <div >
        <Navbar />
        <section className="relative isolate px-6  lg:px-8 text-left">
        {" "}
        {/* Add text-left class */}
        {/* Background shape */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4F46E5] via-[#818CF8] to-[#6366F1] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] pointer-events-none"
            style={{
              clipPath:
                "polygon(50% 0%, 100% 0%, 100% 75%, 75% 100%, 0% 75%, 0% 0%)",
            }}
          ></div>
        </div>
        {/* Content */}
        <div className="mx-auto max-w-7xl py-4 sm:py-8 lg:py-16">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Playground Projects
          </h1>
          <p className="mt-12 text-md leading-8 text-gray-600">
            Create workflows to automate your data processing and analysis.
          </p>
          </div>

        </section>
        <div className="container mx-auto pl-10 pr-20 max-w-7xl ">
          <div className="mb-8 max-w-7xl mx-auto text-center">
            {/* <h1 className="text-3xl font-semibold">Explore Projects</h1> */}
            <form onChange={handleSearch} onSubmit={handleSearch}>
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-400 rounded-l-md p-2 w-full"
                  placeholder="Search your workflows"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          <div className="flex">
            <div className="w-full mb-10">
              <div className="mt-1">
                {filteredProjects.length > 0 ? (
                  <>
                    <h2 className="text-left mb-3 text-gray-600 font-bold"> {totalProjects} {totalProjects === 1 ? "project was": "projects were"} found.</h2>
                    <PlaygroundProjectsList projects={filteredProjects} mode="detail" />
                  </>
                ) : (
                  <div className="text-center text-gray-600">
                    {noProjectsFound ? (
                      <>
                        <h2 className="text-left mb-3 text-gray-600 font-bold"> {totalProjects} {totalProjects === 1 ? "project was": "projects were"} found.</h2>
                        <PlaygroundProjectsList projects={filteredProjects} mode="detail" />
                      </>
                    ) : (
                      <div className="flex justify-center items-center h-[50vh]">
                        <LoadingOutlined style={{ fontSize: '32px' }} spin />
                      </div>
                    )}
                  </div>
                )}

                {projects.length > 0 &&
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                }
              </div>
            </div>
          </div>
        </div>
        {/* <FooterSection /> */}
    </div>
  );
}
