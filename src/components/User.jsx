import PropTypes from 'prop-types'

// Display username in bold
export function User({ username }) {
  return <b>{username}</b>
}

User.propTypes = {
  username: PropTypes.string.isRequired,
}
