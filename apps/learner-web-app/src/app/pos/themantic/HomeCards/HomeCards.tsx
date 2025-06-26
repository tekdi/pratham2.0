'use client';

import React from 'react';
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Typography,
    Box,
    Container,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';

// Interface for card data
interface CardItem {
    id: string;
    title: string;
    image: string;
    imageAlt: string;
}

interface NewArrivalItem {
    id: string;
    title: string;
    image: string;
    imageAlt: string;
}

// Sample data for main grid cards
const mainCards: CardItem[] = [
    {
        id: '1',
        title: 'ENERGY',
        image: '/images/energy.jpg',
        imageAlt: 'Energy concept illustration',
    },
    {
        id: '2',
        title: 'ENVIRONMENT',
        image: '/images/environment.jpg',
        imageAlt: 'Environment concept illustration',
    },
    {
        id: '3',
        title: 'HEALTH',
        image: '/images/health.jpg',
        imageAlt: 'Health concept illustration',
    }
];

// Sample data for new arrivals
const newArrivals: NewArrivalItem[] = [
    {
        id: 'na1',
        title: 'What Do Soft Drinks Do To Your Teeth',
        image: '/images/soft-drink.jpg',
        imageAlt: 'Soft drink effects on teeth',
    },
    {
        id: 'na2',
        title: 'Macronutrients',
        image: '/images/macronutrients.jpg',
        imageAlt: 'Macronutrients illustration',
    },
    {
        id: 'na3',
        title: 'The Human Digestive System',
        image: '/images/digestive-system.jpg',
        imageAlt: 'Human digestive system',
    },
    {
        id: 'na4',
        title: 'Photosynthesis Process',
        image: '/images/photosynthesis.jpg',
        imageAlt: 'Photosynthesis process illustration',
    },
];

const HomeCards = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const router = useRouter();

    // Handle card click
    const handleCardClick = (cardId: string) => {
        console.log('Card clicked:', cardId);
        router.push(`/pos/themantic/themanticCard/${cardId}`);
    };

    // Handle explore button click
    const handleExploreClick = (e: React.MouseEvent, cardId: string) => {
        e.stopPropagation();
        console.log('Explore clicked for:', cardId);
        // Add your navigation logic here
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: `url('/images/mainpagebig.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: { xs: 2, md: 4 },
                py: 4,
            }}
        >
            <Container maxWidth="lg">
                {/* Main Grid Section */}
                <Box sx={{ mb: 6 }}>

                    <Grid container spacing={3}>
                        {mainCards.map((card) => (
                            <Grid item xs={12} sm={6} md={4} key={card.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease-in-out',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                                        },
                                    }}
                                    onClick={() => handleCardClick(card.id)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={card.image}
                                        alt={card.imageAlt}
                                        sx={{
                                            objectFit: 'cover',
                                            background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                                        }}
                                        onError={(e) => {
                                            // Fallback to a placeholder if image fails to load
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzE1MCAxMDAgMTMwIDEyMCAxMDAgMTIwQzEwMCAxMjAgODAgMTAwIDgwIDEwMEM4MCAxMDAgMTAwIDgwIDEwMCA4MEMxMDAgODAgMTIwIDEwMCAxNTAgMTAwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K';
                                        }}
                                    />
                                    <CardContent
                                        sx={{
                                            flexGrow: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            p: 3,
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            component="h2"
                                            sx={{
                                                fontWeight: 700,
                                                textAlign: 'center',
                                                mb: 2,
                                                color: theme.palette.primary.main,
                                                letterSpacing: '0.1em',
                                            }}
                                        >
                                            {card.title}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ p: 3, pt: 0 }}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                        }}
                                        >
                                            <Box>Explore</Box>
                                            <Box>
                                                <img height={'20px'} src={'/images/arrow.png'} alt="" />
                                            </Box>
                                        </Box>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* New Arrivals Section */}
                <Box sx={{ mt: 8 }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            mb: 4,
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                            textAlign: isMobile ? 'center' : 'left',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -8,
                                left: isMobile ? '50%' : 0,
                                transform: isMobile ? 'translateX(-50%)' : 'none',
                                width: 60,
                                height: 3,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                                borderRadius: 2,
                            },
                        }}
                    >
                        New Arrivals
                    </Typography>

                    <Grid container spacing={3}>
                        {newArrivals.map((item) => (
                            <Grid item xs={12} sm={6} md={3} key={item.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease-in-out',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                                        },
                                    }}
                                    onClick={() => handleCardClick(item.id)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={item.image}
                                        alt={item.imageAlt}
                                        sx={{
                                            objectFit: 'cover',
                                            background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                                        }}
                                        onError={(e) => {
                                            // Fallback to a placeholder if image fails to load
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDMwMCAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNTAgNzBDMTUwIDcwIDEzMCA5MCAxMDAgOTBDMTAwIDkwIDgwIDcwIDgwIDcwQzgwIDcwIDEwMCA1MCAxMDAgNTBDMTAwIDUwIDEyMCA3MCAxNTAgNzBaIiBmaWxsPSIjQ0NDQ0NDIi8+Cjwvc3ZnPgo=';
                                        }}
                                    />
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography
                                            variant="body1"
                                            component="h3"
                                            sx={{
                                                fontWeight: 500,
                                                fontSize: '0.9rem',
                                                lineHeight: 1.4,
                                                color: theme.palette.text.primary,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default HomeCards;