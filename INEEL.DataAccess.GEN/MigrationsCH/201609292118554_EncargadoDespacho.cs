namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EncargadoDespacho : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.cat_EncargadoDespacho",
                c => new
                    {
                        ClaveUnidad = c.String(maxLength: 10),
                        FechaEfectiva = c.DateTime(nullable: false),
                        EncargadoDespachoId = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(),
                        FechaEfectivaNombramiento = c.DateTime(nullable: false),
                        FechaFinNombramiento = c.DateTime(),
                    })
                .PrimaryKey(t => t.EncargadoDespachoId)
                .ForeignKey("GEN.cat_UnidadOrganizacional", t => new { t.ClaveUnidad, t.FechaEfectiva })
                .Index(t => new { t.ClaveUnidad, t.FechaEfectiva });
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.cat_EncargadoDespacho", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropIndex("CH.cat_EncargadoDespacho", new[] { "ClaveUnidad", "FechaEfectiva" });
            DropTable("CH.cat_EncargadoDespacho");
        }
    }
}
