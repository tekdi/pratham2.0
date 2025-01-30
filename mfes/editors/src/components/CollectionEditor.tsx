import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import {
  TENANT_ID,
  CHANNEL_ID,
  FRAMEWORK_ID,
  CLOUD_STORAGE_URL,
} from '../utils/app.config';
import {
  getLocalStoredUserName,
  getLocalStoredUserId,
} from '../utils/LocalStorageService';
const CollectionEditor: React.FC = () => {
  const router = useRouter();
  const { identifier } = router.query;
  const [mode, setMode] = useState<any>();
  const [fullName, setFullName] = useState('Anonymous User');
  const [userId, setUserId] = useState(TENANT_ID);
  const [deviceId, setDeviceId] = useState('');

  const [firstName, lastName] = fullName.split(' ');

  useEffect(() => {
    const storedFullName = getLocalStoredUserName();
    const storedUserId = getLocalStoredUserId() || TENANT_ID;
    const storedMode = localStorage.getItem('contentMode');
    setMode(storedMode || 'edit');
    setFullName(storedFullName ?? 'Anonymous User');
    setUserId(storedUserId);

    const generatedDeviceId = uuidv4();
    setDeviceId(generatedDeviceId);
  }, []);

  const editorConfig = {
    context: {
      user: {
        id: userId,
        fullName: fullName,
        firstName: firstName || 'Anonymous',
        lastName: lastName || 'User',
        orgIds: [CHANNEL_ID],
      },
      identifier: identifier || 'do_214193483155898368160',
      channel: CHANNEL_ID,
      framework: FRAMEWORK_ID,
      sid: uuidv4(),
      did: deviceId,
      uid: getLocalStoredUserId() || TENANT_ID,
      additionalCategories: [],
      pdata: {
        id: 'pratham.admin.portal',
        ver: '1.0.0',
        pid: 'pratham-portal',
      },
      contextRollup: {
        l1: CHANNEL_ID,
      },
      tags: [CHANNEL_ID],
      cdata: [
        {
          id: CHANNEL_ID,
          type: 'pratham-portal',
        },
      ],
      timeDiff: 5,
      objectRollup: {},
      host: '',
      defaultLicense: 'CC BY 4.0',
      endpoint: '/data/v3/telemetry',
      env: 'collection_editor',
      cloudStorageUrls: [CLOUD_STORAGE_URL],
    },
    config: {
      mode: mode || 'edit', // edit / review / read / sourcingReview
      maxDepth: 4,
      objectType: 'Collection',
      primaryCategory: 'Course', // Professional Development Course, Curriculum Course
      isRoot: true,
      dialcodeMinLength: 2,
      dialcodeMaxLength: 250,
      iconClass: 'fa fa-book',
      showAddCollaborator: false,
      enableBulkUpload: false,
      children: {},
      hierarchy: {
        level1: {
          name: 'Module',
          type: 'Unit',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'CourseUnit',
          primaryCategory: 'Course Unit',
          iconClass: 'fa fa-folder-o',
          children: {},
        },
        level2: {
          name: 'Sub-Module',
          type: 'Unit',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'CourseUnit',
          primaryCategory: 'Course Unit',
          iconClass: 'fa fa-folder-o',
          children: {
            Content: [
              'Explanation Content',
              'Learning Resource',
              'eTextbook',
              'Teacher Resource',
              'Course Assessment',
            ],
          },
        },
        level3: {
          name: 'Sub-Sub-Module',
          type: 'Unit',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'CourseUnit',
          primaryCategory: 'Course Unit',
          iconClass: 'fa fa-folder-o',
          children: {
            Content: [
              'Explanation Content',
              'Learning Resource',
              'eTextbook',
              'Teacher Resource',
              'Course Assessment',
            ],
          },
        },
        level4: {
          name: 'Sub-Sub-Module',
          type: 'Unit',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'CourseUnit',
          primaryCategory: 'Course Unit',
          iconClass: 'fa fa-folder-o',
          children: {
            Content: [
              'Explanation Content',
              'Learning Resource',
              'eTextbook',
              'Teacher Resource',
              'Course Assessment',
            ],
          },
        },
      },
      contentPolicyUrl: '/term-of-use.html',
    },
  };

  const editorRef = useRef<HTMLDivElement | null>(null);
  const isAppendedRef = useRef(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    const loadAssets = () => {
      const assets = [
        {
          id: 'collection-editor-js',
          src: 'https://cdn.jsdelivr.net/npm/@project-sunbird/sunbird-collection-editor-web-component@latest/sunbird-collection-editor.js',
          type: 'script',
        },
        {
          id: 'collection-editor-css',
          src: 'https://cdn.jsdelivr.net/npm/@project-sunbird/sunbird-collection-editor-web-component@latest/styles.css',
          type: 'link',
        },
        {
          id: 'sunbird-pdf-player-js',
          src: 'https://cdn.jsdelivr.net/npm/@project-sunbird/sunbird-pdf-player-web-component@1.4.0/sunbird-pdf-player.js',
          type: 'script',
        },
        {
          id: 'sunbird-pdf-player-css',
          src: 'https://cdn.jsdelivr.net/npm/@project-sunbird/sunbird-pdf-player-web-component@1.4.0/styles.css',
          type: 'link',
        },
        {
          id: 'sunbird-video-player.js',
          src: 'https://cdn.jsdelivr.net/npm/@project-sunbird/sunbird-video-player-web-component@1.2.5/sunbird-video-player.js',
          type: 'script',
        },
        {
          id: 'sunbird-video-player-css',
          src: 'https://cdn.jsdelivr.net/npm/@project-sunbird/sunbird-video-player-web-component@1.2.5/styles.css',
          type: 'link',
        },
      ];

      assets.forEach((asset) => {
        if (!document.getElementById(asset.id)) {
          if (asset.type === 'script') {
            const script = document.createElement('script');
            script.id = asset.id;
            script.src = asset.src;
            script.async = true;
            script.onload = () => setAssetsLoaded(true);
            document.body.appendChild(script);
          } else if (asset.type === 'link') {
            const link = document.createElement('link');
            link.id = asset.id;
            link.rel = 'stylesheet';
            link.href = asset.src;
            document.head.appendChild(link);
          }
        }
      });
    };

    const removeAsset = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
        element.parentNode?.removeChild(element);
      }
    };

    loadAssets();

    return () => {
      const assetIds = [
        'collection-editor-js',
        'collection-editor-css',
        'sunbird-pdf-player-js',
        'sunbird-pdf-player-css',
        'sunbird-video-player.js',
        'sunbird-video-player-css',
      ];
      assetIds.forEach(removeAsset);
    };
  }, []);

  useEffect(() => {
    if (assetsLoaded && editorRef.current && !isAppendedRef.current) {
      const collectionEditorElement = document.createElement('lib-editor');

      collectionEditorElement.setAttribute(
        'editor-config',
        JSON.stringify(editorConfig)
      );

      collectionEditorElement.addEventListener(
        'editorEmitter',
        (event: any) => {
          console.log('Editor event:', event);
          if (
            event.detail?.action === 'backContent' ||
            event.detail?.action === 'submitContent' ||
            event.detail?.action === 'publishContent' ||
            event.detail?.action === 'rejectContent'
          ) {
            localStorage.removeItem('contentMode');
            window.history.back();
            window.addEventListener(
              'popstate',
              () => {
                window.location.reload();
              },
              { once: true }
            );
          }
        }
      );

      editorRef.current.appendChild(collectionEditorElement);
      isAppendedRef.current = true;
    }
  }, [assetsLoaded]);

  return (
    <div>
      {assetsLoaded ? <div ref={editorRef}></div> : <p>Loading editor...</p>}
    </div>
  );
};
export default CollectionEditor;
