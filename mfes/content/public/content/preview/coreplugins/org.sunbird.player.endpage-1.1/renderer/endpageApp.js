const endPage = angular.module('sunbird-endpage', []);
endPage.controller(
  'endPageController',
  function ($scope, $rootScope, $state, $element, $stateParams) {
    const globalConfig = EkstepRendererAPI.getGlobalConfig();
    $scope.showEndPage = false;
    $rootScope.pageId = 'sunbird-player-Endpage';
    $scope.pluginManifest = { id: 'org.sunbird.player.endpage', ver: '1.1' };
    $scope.genieIcon = null;
    $scope.endpageBackground = null;
    $scope.replayIcon = null;
    $scope.userScore = undefined;
    $scope.totalScore = undefined;
    /**
     * @property - {Object} which holds previous content of current content
     */
    $scope.previousContent = {};
    /**
     * @property - {Object} which holds next content of current content
     */
    $scope.nextContent = {};
    $scope.isCordova = window.cordova ? true : false;
    $scope.pluginInstance = {};
    $scope.arrayToString = function (array) {
      return _.isString(array)
        ? array
        : !_.isEmpty(array) && _.isArray(array)
        ? array.join(', ')
        : '';
    };
    $scope.setLicense = function () {
      $scope.licenseAttribute =
        $scope.playerMetadata.license || 'Licensed under CC By 4.0 license';
    };

    $scope.getTotalScore = function (id) {
      let totalScore = 0;
      let maxScore = 0;
      const teleEvents = org.ekstep.service.content.getTelemetryEvents();
      if (!_.isEmpty(teleEvents) && !_.isUndefined(teleEvents.assess)) {
        _.forEach(teleEvents.assess, function (value) {
          if (value.edata.score) {
            totalScore = totalScore + value.edata.score;
          }
          if (value.edata.item.maxscore) {
            maxScore = maxScore + value.edata.item.maxscore;
          } else {
            maxScore = maxScore + 0;
          }
        });
        $scope.userScore = $scope.convert(totalScore);
        $scope.totalScore = $scope.convert(maxScore);
      }
    };

    $scope.replayContent = function () {
      if (
        !isbrowserpreview &&
        $rootScope.enableUserSwitcher &&
        $rootScope.users.length > 1
      ) {
        EkstepRendererAPI.dispatchEvent('event:openUserSwitchingModal', {
          logGEEvent: $scope.pluginInstance._isAvailable,
        });
      } else {
        $scope.replayCallback();
      }
    };
    $scope.replayCallback = function () {
      EkstepRendererAPI.hideEndPage();
      EkstepRendererAPI.dispatchEvent('renderer:content:replay');
    };

    $scope.setTotalTimeSpent = function () {
      const endEvent = _.filter(TelemetryService._data, function (event) {
        if (event) {
          return event.name == 'OE_END';
        }
      });
      const startTime =
        endEvent.length > 0 ? endEvent[endEvent.length - 1].startTime : 0;
      if (startTime) {
        const totalTime = Math.round((new Date().getTime() - startTime) / 1000);
        const mm = Math.floor(totalTime / 60);
        const ss = Math.floor(totalTime % 60);
        $scope.totalTimeSpent =
          (mm > 9 ? mm : '0' + mm) + ':' + (ss > 9 ? ss : '0' + ss);
      } else {
        $scope.showFeedbackArea = false;
      }
    };
    $scope.openGenie = function () {
      EkstepRendererAPI.dispatchEvent('renderer:genie:click');
    };

    $scope.handleEndpage = function () {
      $scope.setLicense();
      if (_(TelemetryService.instance).isUndefined()) {
        const otherData = GlobalContext.config.otherData;
        !_.isUndefined(otherData.cdata)
          ? correlationData.push(otherData.cdata)
          : correlationData.push({
              id: crypto.getRandomValues(new Uint32Array(1))[0].toString(16),
              type: 'ContentSession',
            });
        TelemetryService.init(
          tsObj._gameData,
          tsObj._user,
          correlationData,
          otherData
        );
      }

      TelemetryService.interact(
        'TOUCH',
        $rootScope.content.identifier,
        'TOUCH',
        {
          stageId: 'ContentApp-EndScreen',
          subtype: 'ContentID',
        }
      );

      setTimeout(function () {
        $rootScope.$apply();
      }, 1000);
      EkstepRendererAPI.dispatchEvent('renderer:splash:hide');
      $scope.setTotalTimeSpent();
      $scope.getTotalScore($rootScope.content.identifier);
      $scope.getRelevantContent($rootScope.content.identifier);
    };

    /**
     * @description - which helps to get previous and next content of current content
     */
    $scope.getRelevantContent = function (contentId) {
      if (!isbrowserpreview) {
        if (
          !_.has($scope.previousContent, contentId) &&
          !_.has($scope.nextContent, contentId)
        ) {
          const requestBody = {
            contentIdentifier: contentId,
            hierarchyInfo: $rootScope.content.hierarchyInfo,
            next: true,
            prev: true,
          };
          //Call getPreviousAndNextContent function which is present inside interfaceService.js by passing current content-id and user-id
          org.ekstep.service.content
            .getRelevantContent(JSON.stringify(requestBody))
            .then(function (response) {
              if (response) {
                $scope.previousContent[contentId] = response.prev;
                $scope.nextContent[contentId] = response.next;
              } else {
                console.log('Error has occurred');
              }
            });
        }
      }
    };

    /**
     * @description - to play next or previous content
     */
    $scope.contentLaunch = function (contentType, contentId) {
      const eleId =
        contentType === 'previous'
          ? 'gc_previousContent'
          : 'gc_nextcontentContent';
      TelemetryService.interact(
        'TOUCH',
        eleId,
        'TOUCH',
        {
          stageId: 'ContentApp-EndScreen',
          plugin: $scope.pluginManifest,
        },
        'GE_INTERACT'
      );

      const contentToPlay =
        contentType === 'previous'
          ? $scope.previousContent[contentId]
          : $scope.nextContent[contentId];
      let contentMetadata = {};
      if (contentToPlay) {
        contentMetadata = contentToPlay.content.contentData;
        _.extend(
          contentMetadata,
          _.pick(
            contentToPlay.content,
            'hierarchyInfo',
            'isAvailableLocally',
            'basePath',
            'rollup'
          )
        );
        contentMetadata.basepath = contentMetadata.basePath;
        $rootScope.content = window.content = content = contentMetadata;
      }

      if (contentToPlay.content.isAvailableLocally) {
        EkstepRendererAPI.hideEndPage();
        const object = {
          config: GlobalContext.config,
          data: undefined,
          metadata: contentMetadata,
        };
        GlobalContext.config = mergeJSON(AppConfig, contentMetadata);
        window.globalConfig = GlobalContext.config;

        org.ekstep.contentrenderer.initializePreview(object);
        EkstepRendererAPI.dispatchEvent('renderer:player:show');
      } else {
        if (
          contentMetadata.identifier &&
          Object.prototype.hasOwnProperty.call(
            window.parent,
            'onContentNotFound'
          )
        ) {
          window.parent.onContentNotFound(
            contentMetadata.identifier,
            contentMetadata.hierarchyInfo
          );
        } else {
          console.warn('Content not Available');
        }
      }
    };

    $scope.initEndpage = function () {
      $scope.playerMetadata = content;
      $scope.genieIcon = EkstepRendererAPI.resolvePluginResource(
        $scope.pluginManifest.id,
        $scope.pluginManifest.ver,
        'renderer/assets/home.png'
      );
      $scope.scoreIcon = EkstepRendererAPI.resolvePluginResource(
        $scope.pluginManifest.id,
        $scope.pluginManifest.ver,
        'renderer/assets/score.svg'
      );
      $scope.leftArrowIcon = EkstepRendererAPI.resolvePluginResource(
        $scope.pluginManifest.id,
        $scope.pluginManifest.ver,
        'renderer/assets/left-arrow.svg'
      );
      $scope.rightArrowIcon = EkstepRendererAPI.resolvePluginResource(
        $scope.pluginManifest.id,
        $scope.pluginManifest.ver,
        'renderer/assets/right-arrow.svg'
      );
      $scope.clockIcon = EkstepRendererAPI.resolvePluginResource(
        $scope.pluginManifest.id,
        $scope.pluginManifest.ver,
        'renderer/assets/clock.svg'
      );
      $scope.replayIcon = EkstepRendererAPI.resolvePluginResource(
        $scope.pluginManifest.id,
        $scope.pluginManifest.ver,
        'renderer/assets/replay.svg'
      );
      $scope.endpageBackground = EkstepRendererAPI.resolvePluginResource(
        $scope.pluginManifest.id,
        $scope.pluginManifest.ver,
        'renderer/assets/endpageBackground.png'
      );
      $scope.handleEndpage();
    };
    EkstepRendererAPI.addEventListener('renderer:content:end', function () {
      $scope.initEndpage();
      $scope.safeApply();
    });
    EkstepRendererAPI.addEventListener('renderer:endpage:show', function () {
      $scope.showEndPage = true;
      $scope.initEndpage();
      document.webkitExitFullscreen();
      $scope.safeApply();
    });
    EkstepRendererAPI.addEventListener('renderer:endpage:hide', function () {
      $scope.showEndPage = false;
      org.ekstep.service.content.clearTelemetryEvents();
      $scope.safeApply();
    });

    $scope.convert = function (num) {
      num = num.toString(); //If it's not already a String
      const index = num.indexOf('.');
      if (index > 0) {
        const floatVal = num.slice(index + 1, index + 3);
        const numSplitVal = num.split('.');
        num = numSplitVal[0] + '.' + floatVal;
      }
      return Number(num); //If you need it back as a Number
    };
  }
);
