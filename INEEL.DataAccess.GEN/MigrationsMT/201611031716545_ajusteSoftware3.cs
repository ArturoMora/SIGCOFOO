namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ajusteSoftware3 : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.SoftwarePersonal", "Adjunto", c => c.Long(nullable: false));
            CreateIndex("MT.SoftwarePersonal", "Adjunto");
            AddForeignKey("MT.SoftwarePersonal", "Adjunto", "GEN.Adjunto", "AdjuntoId", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("MT.SoftwarePersonal", "Adjunto", "GEN.Adjunto");
            DropIndex("MT.SoftwarePersonal", new[] { "Adjunto" });
            DropColumn("MT.SoftwarePersonal", "Adjunto");
        }
    }
}
