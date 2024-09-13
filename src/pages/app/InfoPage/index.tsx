import SectionTitle from '@/components/common/SectionTitle';
import { Alert, AlertDescription, AlertIcon, Box, Center, Container, Grid, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import airQualityImage from '@/assets/images/info-kualitas-udara-image.jpg';
import grkImage from '@/assets/images/info-grk-image.jpg';

export default function Info() {
	const ISPUCategories = [
		{
			name: 'Baik',
			colorName: 'Hijau',
			color: 'green',
			range: '1 - 50',
		},
		{
			name: 'Sedang',
			colorName: 'Biru',
			color: 'blue',
			range: '51 - 100',
		},
		{
			name: 'Tidak Sehat',
			colorName: 'Kuning',
			color: 'yellow',
			range: '101 - 200',
		},
		{
			name: 'Sangat Tidak Sehat',
			colorName: 'Merah',
			color: 'red',
			range: '201 - 300',
		},
		{
			name: 'Berbahaya',
			colorName: 'Hitam',
			color: 'gray',
			range: '> 300 ',
		},
	];

	return (
		<Container className="info-page" maxW="container.md" px='0'>
			<Heading mx="auto" mt="4" textAlign='center' size="lg">
				Kualitas Udara dan Emisi Gas Rumah Kaca
			</Heading>
			<SectionTitle fontSize="2xl">Kualitas udara</SectionTitle>
			<Image
				h="180px"
				rounded="lg"
				objectFit="cover"
				w="100%"
				objectPosition="bottom"
				src={airQualityImage}
			/>
			<Text mt="4">
				<strong>Kualitas udara</strong> mengacu pada kondisi udara di suatu
				lingkungan, yang dinilai berdasarkan parameter seperti konsentrasi
				polutan dan partikel yang dapat mempengaruhi kesehatan manusia,
				hewan, dan ekosistem. Udara yang bersih dan bebas dari gas berbahaya
				sangat penting untuk kesehatan dan kelestarian lingkungan. Udara
				berkualitas baik mendukung pernapasan sehat, mengurangi risiko
				penyakit pernapasan, jantung, serta gangguan kesehatan lainnya.
				Sebaliknya, pencemaran udara dapat menyebabkan gangguan pernapasan,
				meningkatkan risiko kanker paru-paru, dan memperburuk kondisi
				kesehatan seperti asma
			</Text>
			<SectionTitle fontSize="2xl">
				Indeks Standar Pencemar Udara (ISPU)
			</SectionTitle>
			<VStack>
				<Text>
					<strong>Indeks Standar Pencemar Udara (ISPU)</strong> adalah
					sebuah indeks yang memberikan informasi mengenai seberapa bersih
					atau tercemarnya udara di suatu wilayah berdasarkan konsentrasi
					berbagai jenis pencemar udara. Indeks Standar Pencemar Udara
					secara terperinci diatur di{' '}
					<strong>
						Peraturan Menteri Lingkungan Hidup dan Kehutanan Republik
						Indonesia Nomor P.14/MENLHK/SETJEN/KUM.1/7/2020 Tentang Indeks
						Standar Pencemar Udara.
					</strong>
				</Text>
				<Text>
					Parameter yang digunakan dalam perhitungan ISPU adalah Partikulat
					(PM10 dan PM2.5), Karbon Monoksida (CO), Sulfur Dioksida (SO₂),
					Nitrogen Dioksida (NO₂), Ozon (O3), dan Hidrokarbon (HC). Nilai
					ISPU selanjutnya dapat dikelompokkan menjadi lima kategori
					berdasarkan pada rentang nilai tertentu, dengan masing-masing
					warna yang merepresentasikan tingkat kualitas udara.
				</Text>
			</VStack>

			<Grid
				mt="4"
				templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
				gap="3"
			>
				{ISPUCategories.map((e, i) => (
					<HStack
						key={i}
						p="2"
						spacing="4"
						shadow="xs"
						rounded="md"
						minW="200px"
						bg="white"
					>
						<Center
							p="1"
							boxSize="45px"
							shadow="xs"
							rounded="md"
							bg={e.color + '.500'}
							color="white"
							fontSize="sm"
						>
							{e.colorName}
						</Center>
						<Box>
							<Text fontWeight="600">{e.name}</Text>
							<Text
								mt="-1"
								style={{ fontSize: '14px' }}
								color="gray.400"
							>
								Rentang : {e.range}
							</Text>
						</Box>
					</HStack>
				))}
			</Grid>
			<Alert mt="4" rounded="sm" variant="left-accent" alignItems="start">
				<AlertIcon mt="2" boxSize="18px" />
				<AlertDescription as="p">
					Untuk saat ini, Pawana hanya mengkalkulasi ISPU berdasarkan
					partikulat PM2.5 dan PM10, mengikuti ketersediaan sensor yang
					digunakan dalam sistem kami
				</AlertDescription>
			</Alert>
			<SectionTitle fontSize="2xl">Emisi Gas Rumah Kaca</SectionTitle>
			<Image
				h="180px"
				rounded="lg"
				objectFit="cover"
				w="100%"
				objectPosition="bottom"
				src={grkImage}
			/>
			<VStack mt="4">
				<Text>
					<strong>Gas rumah kaca (GRK)</strong> adalah gas di atmosfer yang
					berasal dari proses alami maupun aktivitas manusia, yang mampu
					menyerap dan memancarkan radiasi pada panjang gelombang tertentu,
					menyebabkan terjadinya efek rumah kaca. Dampak dari peningkatan
					GRK meliputi perubahan iklim, pemanasan global, naiknya permukaan
					air laut, cuaca ekstrem, dan gangguan ekosistem. Perubahan ini
					berdampak negatif pada kesehatan manusia, keanekaragaman hayati,
					serta ketahanan pangan dan air.
				</Text>
				<Text>
					<strong>Karbon dioksida (CO₂)</strong> adalah salah satu gas
					rumah kaca yang paling signifikan dalam menyebabkan pemanasan
					global. Peningkatan konsentrasi CO₂ di atmosfer terutama
					disebabkan oleh aktivitas manusia seperti pembakaran bahan bakar
					fosil, deforestasi, dan industri.
				</Text>
				<Text>
					Menurut World Health Organisasion, nilai ambang batas kadar CO₂
					untuk udara bersih adalah 310-330 ppm, sementara udara tercemar
					memiliki kadar CO₂ antara 350-700 ppm. Dengan kata lain udara
					dengan kadar CO₂ lebih dari 700 ppm dapat dikategorikan sebagai
					berbahaya.
				</Text>
				<Alert my="2" rounded="sm" variant="left-accent" alignItems="start">
					<AlertIcon mt="2" boxSize="18px" />
					<AlertDescription as="p">
						Standar ini menjadi acuan dalam menentukan kategori kadar
						emisi gas karbon dioksida dengan beberapa penyesuaian.
						Penyesuaian yang dimaksud adalah rentang untuk udara bersih
						ditetapkan kurang dari 340 ppm, sedangkan udara tercemar
						berada di antara 340-700 ppm.
					</AlertDescription>
				</Alert>
				<Text>
					<strong>Metana (CH₄)</strong> adalah gas rumah kaca utama kedua
					setelah karbon dioksida (CO₂). Meskipun metana terdapat dalam
					jumlah yang lebih kecil di atmosfer, ia memiliki potensi
					pemanasan global yang jauh lebih tinggi dibandingkan CO₂. Metana
					dihasilkan dari aktivitas seperti peternakan, penambangan batu
					bara, serta dekomposisi sampah di tempat pembuangan akhir.
				</Text>

				<Text>
					Menurut American Conference of Governmental Industrial Hygienists
					(ACGIH) dan National Institute for Occupational Safety and Health
					(NIOSH), nilai ambang batas konsentrasi gas metana (CH₄) di udara
					adalah 0,1 % atau 1000 ppm.
				</Text>
				<Alert my="2" rounded="sm" variant="left-accent" alignItems="start">
					<AlertIcon mt="2" boxSize="18px" />
					<AlertDescription as="p">
						Standar ini menjadi acuan dalam penentuan kategori kadar emisi
						gas metana
					</AlertDescription>
				</Alert>
			</VStack>
		</Container>
	);
}
