import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { marcarSaldadoAsync } from "../store/slices/gruposSlice";  // ← cambio
import { registrarPago } from "../store/slices/gastosSlice";
import { cambiarMoneda, setTipoDeCambio } from "../store/slices/monedaSlice";
import { obtenerTipoDeCambio } from "../services/exchangeService";

type Props = NativeStackScreenProps<GruposStackParamList, 'Saldos'>;

type Deuda = {
    deudor: string;
    acreedor: string;
    monto: number;
};

export default function SaldosScreen({ route }: Props) {
    const { grupoId } = route.params;
    const dispatch = useAppDispatch();

    const { monedaActual, tipoDeCambio } = useAppSelector((state) => state.moneda);

    useEffect(() => {
        const cargarTipoDeCambio = async () => {
            const tasa = await obtenerTipoDeCambio();
            dispatch(setTipoDeCambio(tasa));
        };
        cargarTipoDeCambio();
    }, []);

    const convertir = (monto: number) => {
        if (monedaActual === 'USD') return (monto * tipoDeCambio).toFixed(2);
        return monto.toFixed(2);
    };
    const simbolo = monedaActual === 'HNL' ? 'L' : '$';

    const grupo = useAppSelector((state) =>
        state.grupos.grupos.find((g) => g.id === grupoId)
    );
    const gastos = useAppSelector((state) =>
        state.gastos.gastos.filter((g) => g.grupoId === grupoId)
    );
    const pagosRealizados = useAppSelector((state) =>
        state.gastos.pagosRealizados.filter((p) => p.grupoId === grupoId)
    );

    const calcularDeudas = (): Deuda[] => {
        if (!grupo || gastos.length === 0) return [];

        const miembros    = grupo.miembros;
        const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
        const parteIgual  = totalGastos / miembros.length;

        const pagado: Record<string, number> = {};
        miembros.forEach((m) => (pagado[m] = 0));
        gastos.forEach((g) => {
            if (pagado[g.pagadoPor] !== undefined) {
                pagado[g.pagadoPor] += g.monto;
            }
        });

        const balance: Record<string, number> = {};
        miembros.forEach((m) => {
            balance[m] = pagado[m] - parteIgual;
        });

        const deudas: Deuda[] = [];
        const deudores   = miembros.filter((m) => balance[m] < -0.01).map((m) => ({ nombre: m, monto: Math.abs(balance[m]) }));
        const acreedores = miembros.filter((m) => balance[m] > 0.01).map((m) => ({ nombre: m, monto: balance[m] }));

        let i = 0, j = 0;
        while (i < deudores.length && j < acreedores.length) {
            const pago = Math.min(deudores[i].monto, acreedores[j].monto);
            deudas.push({ deudor: deudores[i].nombre, acreedor: acreedores[j].nombre, monto: pago });
            deudores[i].monto   -= pago;
            acreedores[j].monto -= pago;
            if (deudores[i].monto   < 0.01) i++;
            if (acreedores[j].monto < 0.01) j++;
        }

        return deudas;
    };

    const deudas      = calcularDeudas();
    const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
    const miembros    = grupo?.miembros ?? [];
    const parteIgual  = miembros.length > 0 ? totalGastos / miembros.length : 0;

    const yaPago = (deudor: string, acreedor: string) =>
        pagosRealizados.some((p) => p.deudor === deudor && p.acreedor === acreedor);

    const handleMarcarPago = (deudor: string, acreedor: string) => {
        Alert.alert(
            'Confirmar pago',
            `¿${deudor} ya le pagó a ${acreedor}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sí, ya pagó',
                    onPress: async () => {                              // ← async
                        dispatch(registrarPago({ deudor, acreedor, grupoId }));

                        const pagosActualizados = [...pagosRealizados, { deudor, acreedor, grupoId }];
                        const todosSaldados = deudas.every((d) =>
                            pagosActualizados.some((p) => p.deudor === d.deudor && p.acreedor === d.acreedor)
                        );

                        if (todosSaldados) {
                            try {
                                // ← marcarSaldadoAsync en lugar de marcarSaldado
                                await dispatch(marcarSaldadoAsync({
                                    grupoId,
                                    saldado: true,
                                })).unwrap();
                                Alert.alert('🎉 ¡Grupo saldado!', 'Todos han pagado sus deudas');
                            } catch {
                                Alert.alert('Error', 'No se pudo marcar el grupo como saldado');
                            }
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

            {/* Resumen total */}
            <View style={[styles.resumenCard, grupo?.saldado && styles.resumenCardSaldado]}>
                {grupo?.saldado && <Text style={styles.saldadoBadge}>✅ SALDADO</Text>}
                <Text style={styles.resumenTitulo}>Total del grupo</Text>
                <Text style={styles.resumenMonto}>{simbolo} {convertir(totalGastos)}</Text>
                <Text style={styles.resumenSub}>
                    Parte por persona: {simbolo} {convertir(parteIgual)}
                </Text>
            </View>

            {/* Toggle HNL / USD */}
            <View style={styles.toggleRow}>
                <TouchableOpacity
                    style={[styles.toggleBtn, monedaActual === 'HNL' && styles.toggleActivo]}
                    onPress={() => dispatch(cambiarMoneda('HNL'))}
                >
                    <Text style={[styles.toggleText, monedaActual === 'HNL' && styles.toggleTextoActivo]}>
                        🇭🇳 HNL
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleBtn, monedaActual === 'USD' && styles.toggleActivo]}
                    onPress={() => dispatch(cambiarMoneda('USD'))}
                >
                    <Text style={[styles.toggleText, monedaActual === 'USD' && styles.toggleTextoActivo]}>
                        🇺🇸 USD
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Quién pagó cuánto */}
            <Text style={styles.sectionLabel}>Lo que pagó cada quien</Text>
            {miembros.map((m) => {
                const pagado  = gastos.filter((g) => g.pagadoPor === m).reduce((sum, g) => sum + g.monto, 0);
                const balance = pagado - parteIgual;
                return (
                    <View key={m} style={styles.miembroCard}>
                        <Text style={styles.miembroNombre}>{m}</Text>
                        <View style={styles.miembroRight}>
                            <Text style={styles.miembroPagado}>Pagó {simbolo} {convertir(pagado)}</Text>
                            <Text style={[styles.miembroBalance, { color: balance >= 0 ? '#2e7d32' : '#c62828' }]}>
                                {balance >= 0
                                    ? `Le deben ${simbolo} ${convertir(balance)}`
                                    : `Debe ${simbolo} ${convertir(Math.abs(balance))}`}
                            </Text>
                        </View>
                    </View>
                );
            })}

            {/* Deudas a saldar */}
            <Text style={styles.sectionLabel}>Cómo saldar cuentas</Text>
            {deudas.length === 0 ? (
                <View style={styles.saldadoCard}>
                    <Text style={styles.saldadoText}>✅ ¡Todos están a mano!</Text>
                </View>
            ) : (
                deudas.map((d, i) => {
                    const pagado = yaPago(d.deudor, d.acreedor);
                    return (
                        <View key={i} style={[styles.deudaCard, pagado && styles.deudaCardPagada]}>
                            <View style={styles.deudaInfo}>
                                <Text style={[styles.deudaTexto, pagado && styles.deudaTextoPagado]}>
                                    <Text style={styles.bold}>{d.deudor}</Text>
                                    {' le debe a '}
                                    <Text style={styles.bold}>{d.acreedor}</Text>
                                </Text>
                                <Text style={[styles.deudaMonto, pagado && { color: '#2e7d32' }]}>
                                    {simbolo} {convertir(d.monto)}
                                </Text>
                            </View>

                            {pagado ? (
                                <View style={styles.pagadoBadge}>
                                    <Text style={styles.pagadoBadgeText}>✓ Pagado</Text>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.pagarBtn}
                                    onPress={() => handleMarcarPago(d.deudor, d.acreedor)}
                                >
                                    <Text style={styles.pagarBtnText}>Marcar pagado</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })
            )}

            <View style={{ height: 32 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:          { flex: 1, backgroundColor: '#f3f4f6', padding: 16 },
    resumenCard:        { backgroundColor: '#2e4566', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 16 },
    resumenCardSaldado: { backgroundColor: '#2e7d32' },
    saldadoBadge:       { fontSize: 13, fontWeight: '700', color: '#fff', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: 8 },
    resumenTitulo:      { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
    resumenMonto:       { fontSize: 36, fontWeight: '800', color: '#fff', marginTop: 4 },
    resumenSub:         { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
    toggleRow:          { flexDirection: 'row', backgroundColor: '#e8edf5', borderRadius: 8, padding: 4, marginBottom: 16 },
    toggleBtn:          { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
    toggleActivo:       { backgroundColor: '#2e4566' },
    toggleText:         { fontSize: 14, fontWeight: '600', color: '#2e4566' },
    toggleTextoActivo:  { color: '#fff' },
    sectionLabel:       { fontSize: 13, fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 4 },
    miembroCard:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 8 },
    miembroNombre:      { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
    miembroRight:       { alignItems: 'flex-end' },
    miembroPagado:      { fontSize: 13, color: '#666' },
    miembroBalance:     { fontSize: 14, fontWeight: '700', marginTop: 2 },
    deudaCard:          { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 8 },
    deudaCardPagada:    { backgroundColor: '#f1f8e9', borderWidth: 1, borderColor: '#a5d6a7' },
    deudaInfo:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    deudaTexto:         { fontSize: 14, color: '#333', flex: 1 },
    deudaTextoPagado:   { color: '#888' },
    deudaMonto:         { fontSize: 16, fontWeight: '800', color: '#c62828' },
    bold:               { fontWeight: '700' },
    pagarBtn:           { backgroundColor: '#2e4566', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
    pagarBtnText:       { color: '#fff', fontWeight: '700', fontSize: 14 },
    pagadoBadge:        { backgroundColor: '#c8e6c9', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
    pagadoBadgeText:    { color: '#2e7d32', fontWeight: '700', fontSize: 14 },
    saldadoCard:        { backgroundColor: '#e8f5e9', borderRadius: 10, padding: 16, alignItems: 'center' },
    saldadoText:        { fontSize: 15, fontWeight: '700', color: '#2e7d32' },
});