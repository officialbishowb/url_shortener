/**
 * Generate a new API token and display it to the user
 * @param {Event} event  the event object
 */
async function generateToken(event) {
    event.preventDefault();
  
    try {
      const response = await fetch('/api/generate-token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate token');
      }
  
      const data = await response.json();
  
      if (data.message) {
        $('.error-info').html(`* ${data.message}`);
      } else {
        $('#new-api-token').removeClass('d-none');
        $('#api-token').val(data.apiToken);
      }
    } catch (error) {
      console.error(error);
    }
  }
  


/**
 * Shrink the given URL and display it to the user
 * @param {Event} e an event object 
 */
async function shrinkURL(e) {
    e.preventDefault();
    
    const urlInput = $('#url-input');
    const shrinkedUrlInput = $('#shrinked-url');
    const errorInfo = $('.error-info');
    const url = urlInput.val();
    const apiToken = $('#api-token').val();
  
    if (!isValidURL(url)) {
      errorInfo.html('* Please enter a valid URL');
      return;
    }
    
    // Clear error message
    errorInfo.html('');
  
    try {
      const response = await fetch('/api/shrink-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          apiToken
        })
      });
      
      const data = await response.json();
  
      if (data.message) {
        errorInfo.html(`* ${data.message}`);
      } else {
        shrinkedUrlInput.removeClass('d-none');
        shrinkedUrlInput.val(data.shrinkedUrl);
        urlInput.val('');
      }
    } catch (error) {
      console.log(error);
      errorInfo.html('* Something went wrong');
    }
  }
  


/**
 * Copy the given element to the clipboard
 * @param {string} copy_id  the id o f the element to copy
 * @param {Event} e  an event object
 */
function copyToClipboard(copy_id,e){
    e.preventDefault();
    var copyText = document.getElementById(copy_id);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    
    $(e.target).html('Copied');
    setTimeout(function(){
        $(e.target).html('Copy');
    }
    , 2000);
    
}

/**
 * Check if the given URL is valid or not
 * @param {string} url 
 * @returns true if valid, false if not
 */
function isValidURL(url) {
    // The regular expression for matching URLs
    const regex = new RegExp(/^(ftp|http|https):\/\/.+/);
    return regex.test(url);
  }
  