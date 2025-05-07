 const queryString = generateQueryString(searchParams, {
    page: searchParams?.page ?? "1",
    per_page: "12",
  });


export function generateQueryString(
  searchParams,
  defaultParams = {},
) {
  const params = new URLSearchParams()

  // Helper function to add non-empty params
  const addNonEmptyParam = (key, value) => {
    // if (value === undefined) return
    if (value === undefined || value === null || value.trim() === '') return;

    if (Array.isArray(value)) {
      value.filter((v) => v && v.trim() !== "").forEach((v) => params.append(key, v))
    } else if (value && value.trim() !== "") {
      params.set(key, value)
    }
  }

  // Add default params first
  Object.entries(defaultParams).forEach(([key, value]) => {
    addNonEmptyParam(key, value)
  })

  // Add searchParams, overwriting defaults if necessary
  Object.entries(searchParams).forEach(([key, value]) => {
    addNonEmptyParam(key, value)
  })

  return params.toString()
}
