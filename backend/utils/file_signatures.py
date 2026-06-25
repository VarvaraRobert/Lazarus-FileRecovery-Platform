FILE_SIGNATURES = {
    "jpeg": { #10MB
        "header": bytes([0xFF, 0XD8, 0XFF]),
        "footer": bytes([0xFF, 0xD9]),
        "extension": ".jpg",
        "max_size": 10 * 1024 * 1024
    },

    "png": { #10MB
        "header": bytes([0x89, 0x50, 0x4E, 0x47, 0x0D, 0X0A, 0X1A, 0X0A]),
        "footer": bytes([0x49, 0x45, 0x4E, 0X44, 0XAE, 0X42, 0X60, 0X82]),
        "extension": ".png",
        "max_size": 10 * 1024 *1024
    },

    "pdf": { #50MB
        "header": b"%PDF",
        "footer": b"%%EOF",
        "extension": ".pdf",
        "max_size": 50 * 1024 * 1024
    },

    "docx": { #20MB
        "header": bytes([0x50, 0x4B, 0x03, 0x04]),
        "footer": None,
        "extension": ".docx",
        "max_size": 20 * 1024 * 1024 
    },
    "txt": { #1MB
        "header": None,
        "footer": None,
        "extension": ".txt",
        "max_size": 1 * 1024 * 1024 
    },
}