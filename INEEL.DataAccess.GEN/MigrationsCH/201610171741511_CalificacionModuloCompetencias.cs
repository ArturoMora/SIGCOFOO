namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CalificacionModuloCompetencias : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CH.tab_FamiliaUnidad", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropIndex("CH.tab_FamiliaUnidad", new[] { "ClaveUnidad", "FechaEfectiva" });
            CreateTable(
                "CH.cat_CalificacionCompetencias",
                c => new
                    {
                        CalificacionId = c.Int(nullable: false, identity: true),
                        calificacion = c.String(),
                        estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.CalificacionId);
            
            AddColumn("CH.tab_FamiliaUnidad", "unidad", c => c.String(maxLength: 5));
            AddColumn("CH.tab_FamiliaUnidad", "nomUnidad", c => c.String(maxLength: 100));
            DropColumn("CH.tab_FamiliaUnidad", "ClaveUnidad");
            DropColumn("CH.tab_FamiliaUnidad", "FechaEfectiva");
        }
        
        public override void Down()
        {
            AddColumn("CH.tab_FamiliaUnidad", "FechaEfectiva", c => c.DateTime(nullable: false));
            AddColumn("CH.tab_FamiliaUnidad", "ClaveUnidad", c => c.String(maxLength: 10));
            DropColumn("CH.tab_FamiliaUnidad", "nomUnidad");
            DropColumn("CH.tab_FamiliaUnidad", "unidad");
            DropTable("CH.cat_CalificacionCompetencias");
            CreateIndex("CH.tab_FamiliaUnidad", new[] { "ClaveUnidad", "FechaEfectiva" });
            AddForeignKey("CH.tab_FamiliaUnidad", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional", new[] { "ClaveUnidad", "FechaEfectiva" });
        }
    }
}
