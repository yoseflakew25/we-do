const ThreeDotsLoading = () => {
  return (
    <div className='flex items-center'>
      <div className='w-2 h-2 mr-1 bg-primary rounded-full animate-bounce-slow'></div>
      <div
        className='w-2 h-2 mr-1 bg-primary rounded-full animate-bounce-slow'
        style={{ animationDelay: '0.15s' }}
      ></div>
      <div
        className='w-2 h-2 bg-primary rounded-full animate-bounce-slow'
        style={{ animationDelay: '0.3s' }}
      ></div>
    </div>
  );
};

export default ThreeDotsLoading;
