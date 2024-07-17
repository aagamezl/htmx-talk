const getView = async (name) => {
  const file = await Bun.file(name)
  const view = await file.text()

  return view
}

export default getView
