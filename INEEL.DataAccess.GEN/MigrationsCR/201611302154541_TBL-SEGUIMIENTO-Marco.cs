namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TBLSEGUIMIENTOMarco : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.tab_SeguimientoON",
                c => new
                    {
                        SeguimientoOportunidadId = c.Int(nullable: false, identity: true),
                        OportunidadNegocioId = c.Int(nullable: false),
                        FechaRegistro = c.DateTime(nullable: false),
                        ClaveUnidad = c.String(maxLength: 10),
                        InvestigadorId = c.String(maxLength: 10),
                    })
                .PrimaryKey(t => t.SeguimientoOportunidadId)
                .ForeignKey("CR.tab_OportunidadNegocios", t => t.OportunidadNegocioId, cascadeDelete: false)
                .Index(t => t.OportunidadNegocioId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_SeguimientoON", "OportunidadNegocioId", "CR.tab_OportunidadNegocios");
            DropIndex("CR.tab_SeguimientoON", new[] { "OportunidadNegocioId" });
            DropTable("CR.tab_SeguimientoON");
        }
    }
}
