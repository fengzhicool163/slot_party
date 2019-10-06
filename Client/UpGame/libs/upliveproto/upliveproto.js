var UpliveProto = dcodeIO.ProtoBuf.newBuilder({})['import']({
    "package": null,
    "options": {
        "java_package": "com.asiainno.uplive.proto"
    },
    "messages": [
        {
            "name": "Result",
            "fields": [
                {
                    "rule": "optional",
                    "type": "Code",
                    "name": "code",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "msg",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "google.protobuf.Any",
                    "name": "data",
                    "id": 3
                }
            ]
        },
        {
            "name": "UserBalanceInfo",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "inBill",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "outDiamond",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "bill",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "diamond",
                    "id": 4
                }
            ]
        },
        {
            "name": "ProfileInfo",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "uid",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "username",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "upliveCode",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "avatar",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "gender",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "setting",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "password",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "userToken",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "signature",
                    "id": 9
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "grade",
                    "id": 10
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "location",
                    "id": 11
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "mobilePhone",
                    "id": 12
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "fanTotal",
                    "id": 13
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "followTotal",
                    "id": 14
                },
                {
                    "rule": "optional",
                    "type": "UserBalanceInfo",
                    "name": "balance",
                    "id": 15
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "chatroomid",
                    "id": 16
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "followType",
                    "id": 17
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "exp",
                    "id": 18
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "currentExp",
                    "id": 19
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "nextExp",
                    "id": 20
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "officialAuth",
                    "id": 21
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "officialAuthContent",
                    "id": 22
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "qualityAuth",
                    "id": 23
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "countryCode",
                    "id": 25
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "admin",
                    "id": 26
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "userRealNameAuth",
                    "id": 27
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "acceptAgreement",
                    "id": 28
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "upliveCodeStatus",
                    "id": 29
                }
            ]
        },
        {
            "name": "LabelInfo",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "label",
                    "id": 1
                }
            ]
        },
        {
            "name": "PermissionInfo",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "permission",
                    "id": 1
                }
            ]
        },
        {
            "name": "google",
            "fields": [],
            "messages": [
                {
                    "name": "protobuf",
                    "fields": [],
                    "options": {
                        "csharp_namespace": "Google.Protobuf.WellKnownTypes",
                        "go_package": "github.com/golang/protobuf/ptypes/any",
                        "java_package": "com.google.protobuf",
                        "java_outer_classname": "AnyProto",
                        "java_multiple_files": true,
                        "java_generate_equals_and_hash": true,
                        "objc_class_prefix": "GPB"
                    },
                    "messages": [
                        {
                            "name": "Any",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "type_url",
                                    "id": 1
                                },
                                {
                                    "rule": "optional",
                                    "type": "bytes",
                                    "name": "value",
                                    "id": 2
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "Profile",
            "fields": [],
            "messages": [
                {
                    "name": "Get",
                    "fields": [],
                    "options": {
                        "objc_class_prefix": "ProfileGet",
                        "java_package": "com.asiainno.uplive.proto"
                    },
                    "messages": [
                        {
                            "name": "Request",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "int64",
                                    "name": "vuid",
                                    "id": 1
                                }
                            ]
                        },
                        {
                            "name": "Response",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "ProfileInfo",
                                    "name": "profile",
                                    "id": 1
                                },
                                {
                                    "rule": "repeated",
                                    "type": "LabelInfo",
                                    "name": "userlabels",
                                    "id": 2
                                },
                                {
                                    "rule": "repeated",
                                    "type": "PermissionInfo",
                                    "name": "canPermissions",
                                    "id": 3
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "enums": [
        {
            "name": "Code",
            "values": [
                {
                    "name": "DEFAULT",
                    "id": 0
                },
                {
                    "name": "SC_SUCCESS",
                    "id": 1
                },
                {
                    "name": "SC_THIRD_PARTY_ALREADY_BIND",
                    "id": 256
                },
                {
                    "name": "SC_THIRD_CHECK_USER_NOT_REGISTER",
                    "id": 257
                },
                {
                    "name": "SC_PARAMETER_INVALID",
                    "id": 4096
                },
                {
                    "name": "SC_ADMIN_NO_PERMISSION",
                    "id": 4352
                },
                {
                    "name": "SC_ACCOUTN_USER_TOKEN_NOTMATCH",
                    "id": 8192
                },
                {
                    "name": "SC_LOGINED_IN_OTHER_DEVICE",
                    "id": 8193
                },
                {
                    "name": "SC_SMS_VERIFY_CODE_NOMOBILE",
                    "id": 4097
                },
                {
                    "name": "SC_SMS_VERIFY_CODE_FAIL",
                    "id": 4098
                },
                {
                    "name": "SC_SMS_VERIFY_CODE_NOTMATCH",
                    "id": 4099
                },
                {
                    "name": "SC_ACCOUNT_MOBILE_PHONE_REPETITION",
                    "id": 4100
                },
                {
                    "name": "SC_ACCOUNT_MOBILE_PHONE_ALLREADY_BIND",
                    "id": 4101
                },
                {
                    "name": "SC_ACCOUTN_USER_NAME_FORBIDDEN",
                    "id": 4102
                },
                {
                    "name": "SC_ACCOUTN_THIRD_CHECK_FAIL",
                    "id": 4103
                },
                {
                    "name": "SC_ACCOUNT_USER_NAME_OVER_LONG",
                    "id": 4104
                },
                {
                    "name": "SC_ACCOUNT_LIVE_CODE_OVER_LONG",
                    "id": 4105
                },
                {
                    "name": "SC_ACCOUNT_LIVE_CODE_NOT_STANDARD",
                    "id": 4112
                },
                {
                    "name": "SC_ACCOUNT_LIVE_CODE_EXIST",
                    "id": 4113
                },
                {
                    "name": "SC_ACCOUNT_LIVE_UPDATE_FAIL",
                    "id": 4114
                },
                {
                    "name": "SC_ACCOUNT_PASSWORD_ERROR",
                    "id": 4115
                },
                {
                    "name": "SC_ACCOUNT_USER_NOT_EXIST",
                    "id": 4116
                },
                {
                    "name": "SC_ACCOUNT_LIVE_CODE_TOO_SHORT",
                    "id": 4117
                },
                {
                    "name": "SC_ACCOUNT_SIGNATURE_OVER_LONG",
                    "id": 4118
                },
                {
                    "name": "SC_ACCOUTN_USER_FORBIDDEN",
                    "id": 4119
                },
                {
                    "name": "SC_ACCOUNT_RANDOM_NOTEXIST",
                    "id": 4120
                },
                {
                    "name": "SC_ACCOUNT_RANDOM_NOTSCAN",
                    "id": 4121
                },
                {
                    "name": "SC_ACCOUNT_RANDOM_SCANNED",
                    "id": 4128
                },
                {
                    "name": "SC_ACCOUNT_LIVE_CODE_NOLY_MODIFY_ONCE",
                    "id": 4129
                },
                {
                    "name": "SC_ACCOUNT_USER_OR_PASSWORD_ERROR",
                    "id": 4130
                },
                {
                    "name": "SC_EMAIL_SEND_OVER_LIMIT",
                    "id": 4131
                },
                {
                    "name": "SC_EMAIL_VERIFY_INVALID",
                    "id": 4132
                },
                {
                    "name": "SC_EMAIL_NOT_VERIFY",
                    "id": 4133
                },
                {
                    "name": "SC_SENSITIVE_CONTENT",
                    "id": 4609
                },
                {
                    "name": "SC_MALL_GIFT_NOT_EXIST",
                    "id": 12289
                },
                {
                    "name": "SC_MALL_TRANSACTION_REPEATED",
                    "id": 12290
                },
                {
                    "name": "SC_MALL_MONEY_NOT_ENOUGH",
                    "id": 12291
                },
                {
                    "name": "SC_MALL_TRANSACTION_NOT_EXIST",
                    "id": 12292
                },
                {
                    "name": "SC_MALL_PRODUCT_NOT_AVAILABLE",
                    "id": 12293
                },
                {
                    "name": "SC_MALL_ORDER_NOT_EXIST",
                    "id": 12294
                },
                {
                    "name": "SC_MALL_UNIFIED_ORDER_FAIL",
                    "id": 12295
                },
                {
                    "name": "SC_MALL_PAY_FAIL",
                    "id": 12296
                },
                {
                    "name": "SC_MALL_PAY_QUERY_FAIL",
                    "id": 12297
                },
                {
                    "name": "SC_MALL_IAP_VALIDATE_FAIL",
                    "id": 12298
                },
                {
                    "name": "SC_MALL_ORDER_EXIST_NOT_FINISHED",
                    "id": 12299
                },
                {
                    "name": "SC_MALL_NOT_BIND_WECHAT",
                    "id": 12300
                },
                {
                    "name": "SC_MALL_EXCEED_WITHDRAW_TIMES",
                    "id": 12301
                },
                {
                    "name": "SC_MALL_EXCEED_WITHDRAW_QUOTA",
                    "id": 12302
                },
                {
                    "name": "SC_MALL_WITHDRAW_FAIL",
                    "id": 12303
                },
                {
                    "name": "SC_MALL_WITHDRAW_LESS_THAN_MIN",
                    "id": 12304
                },
                {
                    "name": "SC_MALL_WITHDRAW_GREATER_THAN_MAX",
                    "id": 12305
                },
                {
                    "name": "SC_MALL_WITHDRAW_FREQ_LIMIT",
                    "id": 12306
                },
                {
                    "name": "SC_MALL_WITHDRAW_SENDNUM_LIMIT",
                    "id": 12307
                },
                {
                    "name": "SC_MALL_NOT_BIND_PAYPAL",
                    "id": 12308
                },
                {
                    "name": "SC_MALL_IAB_VALIDATE_FAIL",
                    "id": 12309
                },
                {
                    "name": "SC_MALL_BUY_GUARD_DIAMOND_LOW",
                    "id": 12310
                },
                {
                    "name": "SC_MALL_TRANSLATE_NOT_SUPPORT",
                    "id": 12311
                },
                {
                    "name": "SC_MALL_TRANSLATE_CLOSED",
                    "id": 12312
                },
                {
                    "name": "SC_CONTACT_ALREADY_FRIEND",
                    "id": 16385
                },
                {
                    "name": "SC_LIVE_ROOM_NOT_EXIST",
                    "id": 20481
                },
                {
                    "name": "SC_LIVE_ROOM_DISABLED",
                    "id": 20482
                },
                {
                    "name": "SC_LIVE_ROOM_NO_PERMISSION",
                    "id": 20483
                },
                {
                    "name": "SC_LIVE_ROOM_USER_GRADE_NOT_ENOUGH",
                    "id": 20484
                },
                {
                    "name": "SC_LIVE_ROOM_SPECIAL_NOT_CREATE",
                    "id": 20485
                },
                {
                    "name": "SC_LIVE_ROOM_ADMIN_SHUTUP_FAIL",
                    "id": 20486
                },
                {
                    "name": "SC_LIVE_ROOM_ADMIN_LIFTED_FAIL",
                    "id": 20487
                },
                {
                    "name": "SC_LIVE_ROOM_ADMIN_SHUTUP_UIDS_ERROR",
                    "id": 20488
                },
                {
                    "name": "SC_LIVE_ROOM_NO_TEL_AUTH",
                    "id": 20489
                },
                {
                    "name": "SC_LIVE_ROOM_FORCED_OUT",
                    "id": 20490
                },
                {
                    "name": "SC_LIVE_ROOM_NO_REALNAME_AUTH",
                    "id": 20496
                },
                {
                    "name": "SC_ACTIVITY_SEND_DIAMOND_TIME_END",
                    "id": 24577
                },
                {
                    "name": "SC_ACTIVITY_SEND_DIAMOND_OVER_LIMIT",
                    "id": 24578
                },
                {
                    "name": "SC_ACTIVITY_SEND_DIAMOND_ALREADY",
                    "id": 24579
                },
                {
                    "name": "SC_ACTIVITY_NO_RECHARGE",
                    "id": 24580
                },
                {
                    "name": "SC_ACTIVITY_NOT_CONDITIONS",
                    "id": 24581
                },
                {
                    "name": "SC_SYSTEM_ERROR",
                    "id": 16777215
                },
                {
                    "name": "SC_ZMXY_AUTH_BIND_SUCCESS",
                    "id": 28673
                },
                {
                    "name": "SC_ZMXY_AUTH_HAS_BEEN_USEED",
                    "id": 28674
                },
                {
                    "name": "SC_ZMXY_AUTH_HAS_BIND",
                    "id": 28675
                },
                {
                    "name": "SC_ZMXY_AUTH_ERROR",
                    "id": 28676
                },
                {
                    "name": "SC_REDPACKET_OVERDUE_ERROR",
                    "id": 32769
                },
                {
                    "name": "SC_REDPACKET_DISTRIBUTED_ERROR",
                    "id": 32770
                },
                {
                    "name": "SC_REDPACKET_REPEAT_ERROR",
                    "id": 32771
                },
                {
                    "name": "SC_PERMISSIONUSE_NOT_ALLOW",
                    "id": 36865
                },
                {
                    "name": "SC_PERMISSIONUSE_LOW_PERMISSION",
                    "id": 36866
                },
                {
                    "name": "SC_PERMISSIONUSE_OVER_ROOMMAX",
                    "id": 36867
                },
                {
                    "name": "SC_PERMISSIONUSE_OVER_DAYMAX",
                    "id": 36868
                },
                {
                    "name": "SC_PERMISSIONUSE_OVER_ADD_LIMIT",
                    "id": 36869
                },
                {
                    "name": "SC_PERMISSIONUSE_ERROR",
                    "id": 36870
                },
                {
                    "name": "SC_ACTIVITY_EXCHANGE_REPEATED",
                    "id": 65537
                },
                {
                    "name": "SC_ACTIVITY_POINT_NOT_ENOUGH",
                    "id": 65538
                }
            ]
        }
    ]
}).build();