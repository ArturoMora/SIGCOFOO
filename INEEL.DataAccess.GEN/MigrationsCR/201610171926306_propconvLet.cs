namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class propconvLet : DbMigration
    {
        public override void Up()
        {
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
                        PropuestaId = c.String(nullable: false, maxLength: 25),
                    })
                .PrimaryKey(t => t.PropuestaPorConvocatoriaId)
                .ForeignKey("CR.tab_Convocatoria", t => t.ConvocatoriaId, cascadeDelete: true)
                .ForeignKey("GEN.Propuestas", t => t.PropuestaId, cascadeDelete: true)
                .Index(t => t.ConvocatoriaId)
                .Index(t => t.PropuestaId);

            /*CreateTable(
                "GEN.Propuestas",
                c => new
                    {
                        PropuestaId = c.String(nullable: false, maxLength: 25),
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
                .PrimaryKey(t => t.PropuestaId)
                .ForeignKey("CR.cat_Contactos", t => t.ContactoId)
                .ForeignKey("CR.cat_Empresas", t => t.EmpresaId)
                .ForeignKey("CR.UnidadOrganizacionalEmpresas", t => t.ClaveUnidadEmpresa)
                .Index(t => t.EmpresaId)
                .Index(t => t.ClaveUnidadEmpresa)
                .Index(t => t.ContactoId);*/

        }

        public override void Down()
        {
            DropForeignKey("CR.tab_PropuestaPorConvocatoria", "PropuestaId", "GEN.Propuestas");
            /*DropForeignKey("GEN.Propuestas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas");
            DropForeignKey("GEN.Propuestas", "EmpresaId", "CR.cat_Empresas");
            DropForeignKey("GEN.Propuestas", "ContactoId", "CR.cat_Contactos");*/
            DropForeignKey("CR.tab_PropuestaPorConvocatoria", "ConvocatoriaId", "CR.tab_Convocatoria");
            /*DropIndex("GEN.Propuestas", new[] { "ContactoId" });
            DropIndex("GEN.Propuestas", new[] { "ClaveUnidadEmpresa" });
            DropIndex("GEN.Propuestas", new[] { "EmpresaId" });*/
            DropIndex("CR.tab_PropuestaPorConvocatoria", new[] { "PropuestaId" });
            DropIndex("CR.tab_PropuestaPorConvocatoria", new[] { "ConvocatoriaId" });
            //DropTable("GEN.Propuestas");
            DropTable("CR.tab_PropuestaPorConvocatoria");
        }
    }
}
