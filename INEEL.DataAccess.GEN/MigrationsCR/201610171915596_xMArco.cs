namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class xMArco : DbMigration
    {
        public override void Up()
        {

            DropForeignKey("CR.tab_PropuestaPorConvocatoria", "ConvocatoriaId", "CR.tab_Convocatoria");
            /*DropForeignKey("GEN.Propuestas", "ContactoId", "CR.cat_Contactos");
            DropForeignKey("GEN.Propuestas", "EmpresaId", "CR.cat_Empresas");
            DropForeignKey("GEN.Propuestas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas");
            DropForeignKey("CR.tab_PropuestaPorConvocatoria", "PropuestaId", "GEN.Propuestas");
            DropIndex("CR.tab_PropuestaPorConvocatoria", new[] { "ConvocatoriaId" });
            DropIndex("CR.tab_PropuestaPorConvocatoria", new[] { "PropuestaId" });
            DropIndex("GEN.Propuestas", new[] { "EmpresaId" });
            DropIndex("GEN.Propuestas", new[] { "ClaveUnidadEmpresa" });
            DropIndex("GEN.Propuestas", new[] { "ContactoId" });*/
            DropTable("CR.tab_PropuestaPorConvocatoria");
            //DropTable("GEN.Propuestas");
        }
        
        public override void Down()
        {
            /*CreateTable(
                "GEN.Propuestas",
                c => new
                    {
                        PropuestaId = c.String(nullable: false, maxLength: 10),
                        Titulo = c.String(maxLength: 200),
                        ClaveEmpPropuesta = c.String(maxLength: 10),
                        Fecha = c.DateTime(nullable: false),
                        UnidadOrganizacionalId = c.String(maxLength: 10),
                        SubPrograma = c.String(maxLength: 10),
                        Estado = c.Boolean(nullable: false),
                        EstadoPropuesta = c.String(maxLength: 20),
                        Origen = c.String(maxLength: 10),
                        Costos = c.Single(),
                        EmpresaId = c.Int(),
                        ClaveUnidadEmpresa = c.String(maxLength: 20),
                        ContactoId = c.Int(),
                    })
                .PrimaryKey(t => t.PropuestaId);*/
            
            CreateTable(
                "CR.tab_PropuestaPorConvocatoria",
                c => new
                    {
                        PropuestaPorConvocatoriaId = c.Int(nullable: false, identity: true),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                        EdoProp = c.String(maxLength: 30),
                        ConvocatoriaId = c.Int(nullable: false),
                        PropuestaId = c.String(nullable: false, maxLength: 10),
                    })
                .PrimaryKey(t => t.PropuestaPorConvocatoriaId);
            
            /*CreateIndex("GEN.Propuestas", "ContactoId");
            CreateIndex("GEN.Propuestas", "ClaveUnidadEmpresa");
            CreateIndex("GEN.Propuestas", "EmpresaId");*/
            CreateIndex("CR.tab_PropuestaPorConvocatoria", "PropuestaId");
            CreateIndex("CR.tab_PropuestaPorConvocatoria", "ConvocatoriaId");
            AddForeignKey("CR.tab_PropuestaPorConvocatoria", "PropuestaId", "GEN.Propuestas", "PropuestaId", cascadeDelete: true);
            /*AddForeignKey("GEN.Propuestas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
            AddForeignKey("GEN.Propuestas", "EmpresaId", "CR.cat_Empresas", "EmpresaId");
            AddForeignKey("GEN.Propuestas", "ContactoId", "CR.cat_Contactos", "ContactoId");*/
            AddForeignKey("CR.tab_PropuestaPorConvocatoria", "ConvocatoriaId", "CR.tab_Convocatoria", "ConvocatoriaId", cascadeDelete: true);
        }
    }
}
