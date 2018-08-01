namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class camposenITF : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.InformeTecnicoFinal", "idSigco2", c => c.Int());
            AddColumn("MT.InformeTecnicoFinal", "idInformeRIIE", c => c.Int());
            AddColumn("MT.InformeTecnicoFinal", "ultraConfidencial", c => c.Boolean());
            AddColumn("MT.InformeTecnicoFinal", "FechaAutorizacion", c => c.DateTime());
            AddColumn("MT.InformeTecnicoFinal", "FechaPublicacion", c => c.DateTime());
            AddColumn("MT.InformeTecnicoFinal", "ClaveUnidadOrganizacional", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("MT.InformeTecnicoFinal", "ClaveUnidadOrganizacional");
            DropColumn("MT.InformeTecnicoFinal", "FechaPublicacion");
            DropColumn("MT.InformeTecnicoFinal", "FechaAutorizacion");
            DropColumn("MT.InformeTecnicoFinal", "ultraConfidencial");
            DropColumn("MT.InformeTecnicoFinal", "idInformeRIIE");
            DropColumn("MT.InformeTecnicoFinal", "idSigco2");
        }
    }
}
