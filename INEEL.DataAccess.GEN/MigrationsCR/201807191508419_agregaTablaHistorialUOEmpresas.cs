namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregaTablaHistorialUOEmpresas : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.tab_HistorialUnidadesOrganizacionalesEmpresas",
                c => new
                    {
                        historialId = c.Int(nullable: false, identity: true),
                        nombreActualUnidad = c.String(),
                        nombreAnteriorUnidad = c.String(),
                        fecha = c.DateTime(nullable: false),
                        autor = c.String(),
                        contactoId = c.Int(),
                        accion = c.String(),
                        empresaId = c.Int(nullable: false),
                        claveUnidad = c.String(),
                        claveUnidadPadre = c.String(),
                        comentarios = c.String(),
                    })
                .PrimaryKey(t => t.historialId)
                .ForeignKey("CR.cat_Empresas", t => t.empresaId, cascadeDelete: false)
                .Index(t => t.empresaId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_HistorialUnidadesOrganizacionalesEmpresas", "empresaId", "CR.cat_Empresas");
            DropIndex("CR.tab_HistorialUnidadesOrganizacionalesEmpresas", new[] { "empresaId" });
            DropTable("CR.tab_HistorialUnidadesOrganizacionalesEmpresas");
        }
    }
}
