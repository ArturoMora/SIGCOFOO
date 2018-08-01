namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CambioBecarioExternoAcepteNull : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CH.tab_BecarioExterno", "InstitucionID", "CH.cat_Instituciones");
            DropIndex("CH.tab_BecarioExterno", new[] { "InstitucionID" });
            AlterColumn("CH.tab_BecarioExterno", "FechaInicio", c => c.DateTime());
            AlterColumn("CH.tab_BecarioExterno", "FechaTermino", c => c.DateTime());
            AlterColumn("CH.tab_BecarioExterno", "InstitucionID", c => c.Int());
            CreateIndex("CH.tab_BecarioExterno", "InstitucionID");
            AddForeignKey("CH.tab_BecarioExterno", "InstitucionID", "CH.cat_Instituciones", "InstitucionID");
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_BecarioExterno", "InstitucionID", "CH.cat_Instituciones");
            DropIndex("CH.tab_BecarioExterno", new[] { "InstitucionID" });
            AlterColumn("CH.tab_BecarioExterno", "InstitucionID", c => c.Int(nullable: false));
            AlterColumn("CH.tab_BecarioExterno", "FechaTermino", c => c.DateTime(nullable: false));
            AlterColumn("CH.tab_BecarioExterno", "FechaInicio", c => c.DateTime(nullable: false));
            CreateIndex("CH.tab_BecarioExterno", "InstitucionID");
            AddForeignKey("CH.tab_BecarioExterno", "InstitucionID", "CH.cat_Instituciones", "InstitucionID", cascadeDelete: true);
        }
    }
}
