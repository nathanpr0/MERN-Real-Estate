export default function Search() {
  return (
    <>
      <div className="h-full flex lg:flex-row flex-col gap-5 p-10 max-lg:px-5 max-sm:px-3">
        {/* LEFT CONTAINER SEARCH CONFIG */}
        <section className="lg:w-[30vw] w-full bg-white rounded-lg shadow-lg shadow-gray-400 p-10">
          <form>
            <div className="flex flex-col gap-2">
              <label htmlFor="searchTerm" className="text-gray-700 font-medium text-md">
                Search Term
              </label>
              <input
                id="searchTerm"
                name="searchTerm"
                type="search"
                autoComplete="off"
                placeholder="Search..."
                className="w-full shadow-md border-solid border-sky-600 border-2 rounded px-4 py-1 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label htmlFor="sort_order" className="text-gray-700 font-medium text-md">
                Sort
              </label>
              <select
                id="sort_order"
                name="sort_order"
                className="w-full cursor-pointer shadow-md border-solid border-sky-600 border-2 rounded px-4 py-1 focus:outline-none"
              >
                <option>Price High to Low</option>
                <option>Price Low to High</option>
                <option>Latest</option>
                <option>Oldest</option>
              </select>
            </div>

            <div className="mt-4">
              <p className="text-gray-700 font-medium text-md">Type</p>

              <div className="flex gap-5 p-3 mb-2">
                {/* Checkbox 1 */}
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    name="Jual"
                    id="Jual"
                    className="h-6 w-6 shadow-md cursor-pointer"
                  />
                  <label htmlFor="Jual" className="text-sm font-medium text-gray-700 ">
                    Jual
                  </label>
                </div>

                {/* Checkbox 2 */}
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    name="Sewa"
                    id="Sewa"
                    className="h-6 w-6 shadow-md cursor-pointer"
                  />
                  <label htmlFor="Sewa" className="text-sm font-medium text-gray-700 ">
                    Sewa
                  </label>
                </div>

                {/* Checkbox 3 */}
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    name="offer"
                    id="offer"
                    className="h-6 w-6 shadow-md cursor-pointer"
                  />
                  <label htmlFor="offer" className="text-sm font-medium text-gray-700 ">
                    Offer
                  </label>
                </div>
              </div>

              <p className="text-gray-700 font-medium text-md">Lot</p>
              <div className="flex gap-5 p-3 mb-2">
                {/* Checkbox 4 */}
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    name="Rumah"
                    id="Rumah"
                    className="h-6 w-6 shadow-md cursor-pointer"
                  />
                  <label htmlFor="Rumah" className="text-sm font-medium text-gray-700 ">
                    Rumah
                  </label>
                </div>

                {/* Checkbox 5 */}
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    name="Apartemen"
                    id="Apartemen"
                    className="h-6 w-6 shadow-md cursor-pointer"
                  />
                  <label htmlFor="Apartemen" className="text-sm font-medium text-gray-700 ">
                    Apartemen
                  </label>
                </div>
              </div>

              <p className="text-gray-700 font-medium text-md">Facility</p>
              <div className="flex gap-5 p-3 mb-2">
                {/* Checkbox 6 */}
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    name="parking"
                    id="parking"
                    className="h-6 w-6 shadow-md cursor-pointer"
                  />
                  <label htmlFor="parking" className="text-sm font-medium text-gray-700 ">
                    Parking Spot
                  </label>
                </div>

                {/* Checkbox 7 */}
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    name="furnished"
                    id="furnished"
                    className="h-6 w-6 shadow-md cursor-pointer"
                  />
                  <label htmlFor="furnished" className="text-sm font-medium text-gray-700 ">
                    Furnished
                  </label>
                </div>
              </div>
            </div>
          </form>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 rounded text-white text-base max-sm:text-sm font-semibold mt-4 p-2"
          >
            Search
          </button>
        </section>

        {/* RIGHT CONTAINER SEARCH RESULT */}
        <section className="lg:w-[70vw] w-full bg-white rounded-lg shadow-lg shadow-gray-400 p-10">
          <h1 className="text-3xl max-sm:text-2xl text-center text-gray-700 font-semibold mb-4">
            Searching Result
          </h1>
        </section>
      </div>
    </>
  );
}
