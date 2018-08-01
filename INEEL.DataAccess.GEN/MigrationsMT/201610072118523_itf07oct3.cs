namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class itf07oct3 : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.InformeTecnicoFinal", "Titulo", c => c.String(maxLength: 300));
            DropColumn("MT.InformeTecnicoFinal", "Titutlo");
        }
        
        public override void Down()
        {
            AddColumn("MT.InformeTecnicoFinal", "Titutlo", c => c.String(maxLength: 300));
            DropColumn("MT.InformeTecnicoFinal", "Titulo");
        }
    }
}
