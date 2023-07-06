interface NotificationProps {
  errorMessage: string;
}

const Notification = (props: NotificationProps) => {
  if (!props.errorMessage) {
    return null;
  }
  return (
    <p style={{color: 'red'}}>
      {props.errorMessage}
    </p>
  )
};

export default Notification;