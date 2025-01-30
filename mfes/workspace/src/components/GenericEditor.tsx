import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import $ from 'jquery';
import _ from 'lodash';
import 'izimodal/css/iziModal.css';
import 'izimodal/js/iziModal.js';
import editorConfig from './editor.config.json';
import {
  getLocalStoredUserId,
  getLocalStoredUserName,
} from '../services/LocalStorageService';
import { CHANNEL_ID, FRAMEWORK_ID, TENANT_ID } from '../utils/app.config';

const GenericEditor: React.FC = () => {
  const router = useRouter();
  const { identifier, editorforlargecontent } = router.query;
  const [showLoader, setShowLoader] = useState(true);
  const buildNumber = '';
  const extContWhitelistedDomains = 'youtube.com,youtu.be';
  const videoMaxSize = '150';
  const defaultContentFileSize = '150';
  let isLargeFileUpload = false;

  if (editorforlargecontent) {
    isLargeFileUpload = true;
  }

  const handlePopState = (event: any) => {
    console.log('popstate event fired', event.state);
    window.location.hash = 'no';
    if (event.state) {
      // Push the current state back to prevent navigation
      // window.history.pushState(null, '', window.location.href);
      alert('Please use the "x" button to exit this page.');
      window.location.hash = 'no';
    }
    window.location.hash = 'no';
  };

  useEffect(() => {
    // Listen for the popstate event
    window.location.hash = 'no';
    window.addEventListener('popstate', handlePopState);

    return () => {
      // Clean up event listener
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Attach jQuery to window and window.parent
      window.$ = window.jQuery = $;
      if (window.parent) {
        window.parent.$ = window.$;
        window.parent.jQuery = window.jQuery;
      }

      console.log('editorConfig ==>', editorConfig);
      getContentDetails(identifier)
        .then((data: any) => {
          initEditor();
          setWindowContext(data);
          setWindowConfig();
          console.log('window.config ==>', window.config);
          console.log('window.context ==>', window.context);
          $('#genericEditor').iziModal('open');
          setShowLoader(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          closeModal();
        });
    }
  }, [identifier]);

  const getContentDetails = async (contentId: any) => {
    if (!contentId) {
      return {}; // Return empty object if contentId is undefined
    }

    try {
      const response = await fetch(
        `/action/content/v3/read/${contentId}?fields=createdBy,status,mimeType,contentType,resourceType,collaborators,contentDisposition,primaryCategory,framework,targetFWIds&mode=edit`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const data = await response.json();
      return data.result.content;
    } catch (err: any) {
      console.error(err);
      return null;
    }
  };

  // Initialize the modal and open iframe
  const initEditor = () => {
    if (typeof window !== 'undefined') {
      $('#genericEditor').iziModal({
        title: '',
        iframe: true,
        //online from tekdinext
        iframeURL: `generic-editor/index.html?${buildNumber}`,
        navigateArrows: false,
        fullscreen: true,
        openFullscreen: true,
        closeOnEscape: true,
        overlayClose: false,
        overlay: false,
        history: false,
        closeButton: true,
        onClosing: () => {
          closeModal();
        },
      });
    }
  };

  // Set window context for the iframe
  const setWindowContext = (data: any) => {
    if (typeof window !== 'undefined') {
      window['context'] = _.cloneDeep(
        editorConfig.GENERIC_EDITOR.WINDOW_CONTEXT
      );
      if (identifier) {
        window['context'].contentId = identifier;
      }
      window['context'].user = {
        id: getLocalStoredUserId() || TENANT_ID,
        name: getLocalStoredUserName() || 'Anonymous User',
        orgIds: [CHANNEL_ID],
        organisations: {
          [CHANNEL_ID]: CHANNEL_ID + ' Channel',
        },
      };
      window['context'].uid = getLocalStoredUserId() || TENANT_ID;
      window['context'].contextRollUp.l1 = CHANNEL_ID;
      window['context'].tags = [CHANNEL_ID];
      window['context'].channel = CHANNEL_ID;
      window['context'].framework = FRAMEWORK_ID;
      if (
        isLargeFileUpload ||
        _.get(data, 'contentDisposition') === 'online-only'
      ) {
        window.context['uploadInfo'] = {
          isLargeFileUpload: true,
        };
      }
    }
  };

  // Set window config for the iframe
  const setWindowConfig = () => {
    if (typeof window !== 'undefined') {
      window['config'] = _.cloneDeep(editorConfig.GENERIC_EDITOR.WINDOW_CONFIG);
      window['config'].build_number = buildNumber;
      window['config'].headerLogo = '/logo.png';
      window['config'].lock = {};
      window['config'].extContWhitelistedDomains = extContWhitelistedDomains;
      window['config'].enableTelemetryValidation = false;
      window['config'].videoMaxSize = videoMaxSize;
      window['config'].defaultContentFileSize = defaultContentFileSize;
      window['config'].cloudStorage = {
        provider: 'aws',
        presigned_headers: {
          'x-amz-acl': 'private', // This header sets access control; it's specific to AWS S3.
        },
      };
    }
  };

  // Function to close the modal and navigate away
  const closeModal = () => {
    setShowLoader(false);

    const previousPage = sessionStorage.getItem('previousPage');
    const editorElement = document.getElementById('genericEditor');
    if (editorElement) {
      editorElement.remove();
    }
    console.log('history', window.history.length);
    // window.history.back();

    if (previousPage) {
      // window.location.href = previousPage; // Navigate to the previous URL
      router.replace(previousPage);
    } else {
      // window.location.href = '/workspace/content/create';
      router.replace('/workspace/content/create');
    }
  };

  return (
    <div>
      <div id="genericEditor"></div>
      {showLoader && <div>Loading.....</div>}
    </div>
  );
};

export default GenericEditor;
