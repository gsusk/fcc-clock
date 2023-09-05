function useButton(action, length, dispatch) {
  if (length === 1 && action === 'decrement') {
    return
  }

  dispatch(action, length)
}